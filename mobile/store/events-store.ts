import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { supabase } from "@/config/supabase";
import { mapEvent, mapGame, mapGameDetail } from "@/utils/event";
import { Event, Game } from "@/types/event";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "@/store/auth-store";


interface EventsState {
  events: Record<string, Event>;
  games:  Record<string, Game>;
  currentEvent: Event | null; //TODO
  currentGame: Game | null; //TODO
  isLoading: boolean;
  
  // Actions
  fetchEvents: () => Promise<void>;
  refreshEvent: (eventId: string) => Promise<void>;
  fetchGameDetails: (gameId: string) => Promise<void>;
  setCurrentEvent: (id: string | null) => void;
  setCurrentGame:  (id: string | null) => void;
  registerForEvent: (eventId: string, userId: string) => Promise<boolean>;
  isUserRegisteredForEvent: (eventId: string, userId: string) => Promise<boolean>;
  assignVolunteerToGame : (userId: string, gameId: string, eventId: string) => Promise<boolean>;
  unassignVolunteerFromGame : (userId: string, gameId: string)=> Promise<boolean>;
  saveScore: (
    payload: {
      gameId:     string
      divisionId: string
      childId:    string
      score:      number
      position:   number
      medal:      "none" | "gold" | "silver" | "bronze"
    }
  ) => Promise<boolean>;
}


/* ---------- Store ---------- */
export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      /* --- initial state --- */
      events: {},
      games: {},

      currentEvent: null,
      currentGame: null,

      isLoading: false,

      /* --- actions --- */
      fetchEvents: async () => {
        set({ isLoading: true });

        const { data, error } = await supabase
          .from("v_events_with_games")
          .select("*")
          .order("date", { ascending: true });

        if (error) {
          console.error("fetchEvents error", error);
          return set({ isLoading: false });
        }

        const events: Record<string, Event> = {};
        const games: Record<string, Game> = {};

        data!.forEach((row) => {
          const evt = mapEvent(row);
          events[evt.id] = evt;

          (row.games ?? []).forEach((g: any) => {
            const gm = mapGame(g);
            gm.eventId = evt.id;
            games[gm.id] = gm;
          });
        });

        set({ events, games, isLoading: false });
      },

      refreshEvent: async (eventId) => {
        const { data, error } = await supabase
          .from("v_events_with_games")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) return console.error(error);

        set((state) => {
          const evt = mapEvent(data);
          const updatedEvents = { ...state.events, [evt.id]: evt };

          const newGames = { ...state.games };
          (data.games ?? []).forEach((g: any) => {
            const gm = mapGame(g);
            gm.eventId = evt.id;
            newGames[gm.id] = gm;
          });

          return { events: updatedEvents, games: newGames };
        });
      },

      fetchGameDetails: async (gameId) => {
        set({ isLoading: true });

        const { data, error } = await supabase
          .from("v_game_details")
          .select("*")
          .eq("game_id", gameId)
          .single();

        set({ isLoading: false });

        if (error) return console.error(error);

        const detailed = mapGameDetail(data);

        set((state) => ({
          games: { ...state.games, [gameId]: detailed },
          currentGame: detailed,
        }));
      },

      registerForEvent: async (
        eventId: string,
        userId: string
      ): Promise<boolean> => {
        const userRole = useAuthStore.getState().currentUserRole();
        let result;
        // prevent duplicate registration by checking first
        const { data: existing, error } = await supabase
          .from("event_game_registration")
          .select("id")
          .eq("event_id", eventId)
          .eq("user_id", userId)
          .limit(1);

        if (error) {
          console.error("Check failed:", error);
          return false;
        }

        if (existing && existing.length > 0) {
          console.warn("Already registered.");
          return true;
        }
        if (userRole === "parent") {
          result = await supabase.rpc("register_parent_for_event", {
            p_event_id: eventId,
            p_parent_id: userId,
          });
        } else {
          // Direct insert for volunteer
          const { data: insertData, error: insertError } = await supabase
            .from("event_game_registration")
            .insert([
              {
                event_id: eventId,
                user_id: userId,
                registered_at: new Date().toISOString(),
                // child_id, division_id, game_id left null
              },
            ]);

          result = { data: insertData, error: insertError };
        }

        if (result.error) {
          console.error("Registration failed:", result.error);
          return false;
        }

        await get().refreshEvent(eventId); // optional: refresh updated registration state
        return true;
      },

      saveScore: async ({
        gameId,
        divisionId,
        childId,
        score,
        position,
        medal,
      }) => {
        const { error } = await supabase.from("game_scores").upsert(
          {
            event_id: get().events[gameId],
            game_id: gameId,
            division_id: divisionId,
            child_id: childId,
            score,
            position,
            medal,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "game_id,division_id,child_id" }
        );
        if (error) {
          console.error("Error saving score:", error);
          return false;
        }
        // refresh our detail so UI updates:
        await get().fetchGameDetails(gameId);
        return true;
      },

      isUserRegisteredForEvent: async (
        eventId: string,
        userId: string
      ): Promise<boolean> => {
        const { data, error } = await supabase
          .from("event_game_registration")
          .select("id")
          .eq("event_id", eventId)
          .eq("user_id", userId)
          .limit(1);

        if (error) {
          console.error("Error checking event registration", error);
          return false;
        }

        return data.length > 0;
      },

      assignVolunteerToGame: async (
        userId: string,
        gameId: string,
        eventId: string
      ): Promise<boolean> => {
        const { data, error } = await supabase
          .from("game_volunteer_assignments")
          .upsert(
            {
              volunteer_id: userId,
              game_id: gameId,
              event_id: eventId,
              assigned: true,
              assigned_at: new Date().toISOString(),
            },
            { onConflict: "game_id,volunteer_id" }
          );

        if (error) {
          console.error("Error assigning volunteer:", error);
          return false;
        }
        return true;
      },

      unassignVolunteerFromGame: async (
        userId: string,
        gameId: string
      ): Promise<boolean> => {
        const { data, error } = await supabase
          .from("game_volunteer_assignments")
          .update({ assigned: false, unassigned_at: new Date().toISOString() })
          .eq("game_id", gameId)
          .eq("volunteer_id", userId);

        if (error) {
          console.error("Error unassigning volunteer:", error);
          return false;
        }
        return true;
      },

      setCurrentEvent: (id) =>
        set((s) => ({ currentEvent: id ? s.events[id] ?? null : null })),

      setCurrentGame: (id) =>
        set((s) => ({ currentGame: id ? s.games[id] ?? null : null })),
    }),

    /* --- persist options --- */
    {
      name: "events-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        events: state.events,
        games: state.games,
      }),
    }
  )
);

//import { persist, createJSONStorage } from "zustand/middleware";
//import { Event, EventStatus, Game } from "@/types/event";
//import { getEventStatus } from "@/constants/settings";

// Import mock data from mocks folder
//import { events as mockEvents } from "@/mocks/events";
//import { games as mockGames } from "@/mocks/games";
  /*
  fetchGames: () => Promise<void>;
  setCurrentEvent: (eventId: string) => void;
  setCurrentGame: (gameId: string) => void;
  updateGameStatus: (gameId: string, status: Game["status"]) => void;
  updateGameDetails: (gameId: string, gameData: Partial<Game>) => Promise<boolean>;
  updateEventDetails: (eventId: string, eventData: Partial<Event>) => Promise<boolean>;
  registerChildForGame: (childId: string, gameId: string) => Promise<boolean>;
  unregisterChildFromGame: (childId: string, gameId: string) => Promise<boolean>;
  assignVolunteerToGame: (volunteerId: string, gameId: string) => Promise<boolean>;
  removeVolunteerFromGame: (volunteerId: string, gameId: string) => Promise<boolean>;
  registerForEvent: (eventId: string, userId: string) => Promise<boolean>;
  unregisterFromEvent: (eventId: string, userId: string) => Promise<boolean>;
  updateEventStatuses: () => void;
  */

/*
export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: formattedMockEvents,
      games: formattedMockGames,
      currentEvent: null,
      currentGame: null,
      isLoading: false,
      
      fetchEvents: async () => {
        set({ isLoading: true });
        
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll use mock data
          const updatedEvents = formattedMockEvents.map(event => ({
            ...event,
            status: getEventStatus(event.date)
          }));
          
          set({ events: updatedEvents, isLoading: false });
        } catch (error) {
          console.error("Error fetching events:", error);
          set({ isLoading: false });
        }
      },
      
      fetchGames: async () => {
        set({ isLoading: true });
        
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll use mock data
          set({ games: formattedMockGames, isLoading: false });
        } catch (error) {
          console.error("Error fetching games:", error);
          set({ isLoading: false });
        }
      },
      
      setCurrentEvent: (eventId) => {
        const event = get().events.find((e) => e.id === eventId) || null;
        if (event) {
          // Update status based on current date
          const updatedEvent = {
            ...event,
            status: getEventStatus(event.date)
          };
          set({ currentEvent: updatedEvent });
        } else {
          set({ currentEvent: null });
        }
      },
      
      setCurrentGame: (gameId) => {
        const game = get().games.find((g) => g.id === gameId) || null;
        set({ currentGame: game });
      },
      
      updateGameStatus: (gameId, status) => {
        const updatedGames = get().games.map((game) => 
          game.id === gameId ? { ...game, status } : game
        );
        set({ games: updatedGames });
        
        // Update current game if it's the one being modified
        const currentGame = get().currentGame;
        if (currentGame?.id === gameId) {
          set({ currentGame: { ...currentGame, status } });
        }
      },
      
      updateGameDetails: async (gameId, gameData) => {
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll update the local state
          const updatedGames = get().games.map((game) => 
            game.id === gameId ? { ...game, ...gameData } : game
          );
          
          set({ games: updatedGames });
          
          // Update current game if it's the one being modified
          const currentGame = get().currentGame;
          if (currentGame?.id === gameId) {
            set({ currentGame: { ...currentGame, ...gameData } });
          }
          
          return true;
        } catch (error) {
          console.error("Error updating game details:", error);
          return false;
        }
      },
      
      updateEventDetails: async (eventId, eventData) => {
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll update the local state
          const updatedEvents = get().events.map((event) => {
            if (event.id === eventId) {
              const updatedEvent = { ...event, ...eventData };
              // Recalculate status if date was updated
              if (eventData.date) {
                updatedEvent.status = getEventStatus(updatedEvent.date);
              }
              return updatedEvent;
            }
            return event;
          });
          
          set({ events: updatedEvents });
          
          // Update current event if it's the one being modified
          const currentEvent = get().currentEvent;
          if (currentEvent?.id === eventId) {
            const updatedEvent = { ...currentEvent, ...eventData };
            if (eventData.date) {
              updatedEvent.status = getEventStatus(updatedEvent.date);
            }
            set({ currentEvent: updatedEvent });
          }
          
          return true;
        } catch (error) {
          console.error("Error updating event details:", error);
          return false;
        }
      },
      
      registerChildForGame: async (childId, gameId) => {
        try {
          const updatedGames = get().games.map((game) => {
            if (game.id === gameId) {
              const registeredParticipants = game.registeredParticipants || [];
              
              // Check if already registered
              if (registeredParticipants.includes(childId)) {
                return game;
              }
              
              return {
                ...game,
                registeredParticipants: [...registeredParticipants, childId],
              };
            }
            return game;
          });
          
          set({ games: updatedGames });
          return true;
        } catch (error) {
          console.error("Error registering child for game:", error);
          return false;
        }
      },
      
      unregisterChildFromGame: async (childId, gameId) => {
        try {
          const updatedGames = get().games.map((game) => {
            if (game.id === gameId && game.registeredParticipants) {
              return {
                ...game,
                registeredParticipants: game.registeredParticipants.filter(id => id !== childId),
              };
            }
            return game;
          });
          
          set({ games: updatedGames });
          return true;
        } catch (error) {
          console.error("Error unregistering child from game:", error);
          return false;
        }
      },
      
      assignVolunteerToGame: async (volunteerId, gameId) => {
        try {
          const updatedGames = get().games.map((game) => {
            if (game.id === gameId) {
              const assignedVolunteers = game.assignedVolunteers || [];
              
              // Check if already assigned
              if (assignedVolunteers.includes(volunteerId)) {
                return game;
              }
              
              return {
                ...game,
                assignedVolunteers: [...assignedVolunteers, volunteerId],
              };
            }
            return game;
          });
          
          set({ games: updatedGames });
          
          // Update current game if it's the one being modified
          const currentGame = get().currentGame;
          if (currentGame?.id === gameId) {
            const assignedVolunteers = currentGame.assignedVolunteers || [];
            set({ 
              currentGame: { 
                ...currentGame, 
                assignedVolunteers: [...assignedVolunteers, volunteerId] 
              } 
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error assigning volunteer to game:", error);
          return false;
        }
      },
      
      removeVolunteerFromGame: async (volunteerId, gameId) => {
        try {
          const updatedGames = get().games.map((game) => {
            if (game.id === gameId && game.assignedVolunteers) {
              return {
                ...game,
                assignedVolunteers: game.assignedVolunteers.filter(id => id !== volunteerId),
              };
            }
            return game;
          });
          
          set({ games: updatedGames });
          
          // Update current game if it's the one being modified
          const currentGame = get().currentGame;
          if (currentGame?.id === gameId && currentGame.assignedVolunteers) {
            set({ 
              currentGame: { 
                ...currentGame, 
                assignedVolunteers: currentGame.assignedVolunteers.filter(id => id !== volunteerId) 
              } 
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error removing volunteer from game:", error);
          return false;
        }
      },
      
      
      registerForEvent: async (eventId, userId) => {
        try {
          const event = get().events.find(e => e.id === eventId);
          
          // Don't allow registration for past events
          if (event && (event.status === "completed" || event.status === "past" || event.status === "complete")) {
            return false;
          }
          
          const updatedEvents = get().events.map((event) => {
            if (event.id === eventId) {
              const registeredParticipants = event.registeredParticipants || [];
              
              // Check if already registered
              if (registeredParticipants.includes(userId)) {
                return event;
              }
              
              return {
                ...event,
                registeredParticipants: [...registeredParticipants, userId],
              };
            }
            return event;
          });
          
          set({ events: updatedEvents });
          
          // Update current event if it's the one being modified
          const currentEvent = get().currentEvent;
          if (currentEvent?.id === eventId) {
            const registeredParticipants = currentEvent.registeredParticipants || [];
            set({ 
              currentEvent: { 
                ...currentEvent, 
                registeredParticipants: [...registeredParticipants, userId] 
              } 
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error registering for event:", error);
          return false;
        }
      },
      
      unregisterFromEvent: async (eventId, userId) => {
        try {
          const event = get().events.find(e => e.id === eventId);
          
          // Don't allow unregistration for past events
          if (event && (event.status === "completed" || event.status === "past" || event.status === "complete")) {
            return false;
          }
          
          const updatedEvents = get().events.map((event) => {
            if (event.id === eventId && event.registeredParticipants) {
              return {
                ...event,
                registeredParticipants: event.registeredParticipants.filter(id => id !== userId),
              };
            }
            return event;
          });
          
          set({ events: updatedEvents });
          
          // Update current event if it's the one being modified
          const currentEvent = get().currentEvent;
          if (currentEvent?.id === eventId && currentEvent.registeredParticipants) {
            set({ 
              currentEvent: { 
                ...currentEvent, 
                registeredParticipants: currentEvent.registeredParticipants.filter(id => id !== userId) 
              } 
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error unregistering from event:", error);
          return false;
        }
      },
      
      updateEventStatuses: () => {
        const updatedEvents = get().events.map(event => ({
          ...event,
          status: getEventStatus(event.date)
        }));
        
        set({ events: updatedEvents });
        
        // Update current event if there is one
        const currentEvent = get().currentEvent;
        if (currentEvent) {
          set({
            currentEvent: {
              ...currentEvent,
              status: getEventStatus(currentEvent.date)
            }
          });
        }
      }
    }),
    {
      name: "events-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
*/