import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Child } from "@/types/user";
import { children as mockChildren } from "@/mocks/children";
import { supabase } from "@/config/supabase";
import { getCurrentUserId } from "@/utils/auth";
import { Alert } from "react-native";

interface ChildrenState {
  children: Child[];
  isLoading: boolean;

  // Actions
  fetchChildren: () => Promise<void>;
  addChild: (
    childData: Omit<Child, "id" | "scores" | "registeredGames">
  ) => Promise<boolean>;
  updateChild: (childId: string, childData: Partial<Child>) => Promise<boolean>;
}

// Helper: map snake_case to camelCase
function mapChildFromDB(child: any): Child {
  return {
    id: child.id,
    name: child.name,
    age: child.age,
    gender: child.gender,
    division: child.division,
    parentId: child.parent_id,
    photoUrl: child.photo_url,
    tamilGrade: child.tamil_grade,
    tamilSchool: child.tamil_school,
    medicalInfo: child.medical_info,
    registeredGames: [],
    results: [],
  };
}

function mapChildToDB(child: Partial<Child>) {
  const { name, parentId, age, gender, division, photoUrl, tamilGrade, tamilSchool,medicalInfo } = child;
  return {
    name: name,
    parent_id: parentId,
    age: age,
    gender: gender,
    division: division,
    photo_url: photoUrl,
    tamil_grade: tamilGrade,
    tamil_school: tamilSchool,
    medical_info: medicalInfo,
  };
}

export const useChildrenStore = create<ChildrenState>()(
  persist(
    (set, get) => ({
      children: mockChildren,
      isLoading: false,

      fetchChildren: async () => {
        set({ isLoading: true });

        try {
          const parentId = await getCurrentUserId();
          console.log("Inside fetchChildren...");

          if (!parentId) {
            console.warn("No parent logged in");
            set({ children: [], isLoading: false });
            return;
          }

          // 1) fetch all children for this parent
          const { data: childRows, error: childErr } = await supabase
            .from("children")
            .select("*")
            .eq("parent_id", parentId);

          if (childErr) {
            // console.log("Error when fetching children..");
            throw childErr;
          }

          // Convert snake_case from DB to camelCase for UI
          const mappedChildren = (childRows ?? []).map(mapChildFromDB);
          const childIds = mappedChildren.map((c) => c.id);

          // 2) fetch all registrations for those children
          const { data: regs, error: regsErr } = await supabase
            .from("event_game_registration")
            .select("child_id, game_id")
            .in("child_id", childIds);

          if (regsErr) throw regsErr;

          // build lookup childId → [gameId, …]
          const gamesByChild: Record<string, string[]> = {};
          regs.forEach(({ child_id, game_id }) => {
            if (!gamesByChild[child_id]) gamesByChild[child_id] = [];
            gamesByChild[child_id].push(game_id);
          });

          // 3) fetch all scores (with position + medal)
          const { data: scoreRows, error: scoresErr } = await supabase
            .from("game_scores")
            .select("child_id, game_id, score, position, medal")
            .in("child_id", childIds);
          if (scoresErr) throw scoresErr;

          // build lookup childId → [ { gameId, score, position, medal } … ]
          const resultsByChild: Record<
            string,
            {
              gameId: string;
              score: number;
              position: number | null;
              medal: string;
            }[]
          > = {};
          scoreRows.forEach(({ child_id, game_id, score, position, medal }) => {
            if (!resultsByChild[child_id]) resultsByChild[child_id] = [];
            resultsByChild[child_id].push({
              gameId: game_id,
              score,
              position,
              medal,
            });
          });

          // 4) assemble final shape
          const finalChildren: Child[] = mappedChildren.map((c) => ({
            ...c,
            registeredGames: gamesByChild[c.id] ?? [],
            results: (resultsByChild[c.id] ?? []).map((r) => ({
              gameId:  r.gameId,
              score:   r.score,
              position: r.position ?? undefined,
              medal:   r.medal as Child["results"][number]["medal"],
            })),
          }));
          

          set({ children: finalChildren, isLoading: false });
        } catch (error) {
          console.error("Error fetching children:", error);
          set({ isLoading: false });
        }
      },

      addChild: async (
        childData: Omit<Child, "id" | "scores" | "registeredGames">
      ): Promise<boolean> => {
        set({ isLoading: true });
        try {
          const parentId = await getCurrentUserId();
      
          if (!parentId) {
            console.warn("No parent logged in");
            set({ isLoading: false });
            return false;
          }
      
          // Early check: Is the parent already registered for an event?
          const { data: registrations, error: regError } = await supabase
            .from("event_game_registration")
            .select("event_id")
            .eq("user_id", parentId)
            .limit(1);
      
          if (regError && regError.code !== "PGRST116") {
            throw regError;
          }
      
          if (registrations && registrations.length > 0) {
            console.warn("Parent already registered for an event. Cannot add child.");
            Alert.alert("Action Not Allowed", "Adding child is not allowed after registering for the event.");
            set({ isLoading: false });
            return false;
          }
      
          const insertPayload = mapChildToDB(childData);
      
          const { data: childRow, error: insertError } = await supabase
            .from("children")
            .insert(insertPayload)
            .select()
            .single();
      
          if (insertError) throw insertError;
      
          const newChild: Child = {
            ...childRow,
            registeredGames: [],
            scores: [],
          };
      
          set({ children: [...get().children, newChild], isLoading: false });
          return true;
        } catch (error) {
          console.error("Error when adding child:", error);
          set({ isLoading: false });
          return false;
        }
      },
      
      
      // addChild: async (childData) => {
      //   set({ isLoading: true });
      //   try {
      //     const parentId = await getCurrentUserId();

      //     if (!parentId) {
      //       console.warn("No parent logged in");
      //       set({ isLoading: false });
      //       return false;
      //     }

      //     // const { parentId: _, photoUrl, ...cleanChildData } = childData; // temp fix to remove the parentId and photoUrl TBD better approach

      //     const insertPayload = mapChildToDB(childData);

      //     console.log("🔍 Insert payload to Supabase:", insertPayload);

      //     const { data: childRow, error } = await supabase
      //       .from("children")
      //       .insert(insertPayload)
      //       .select()
      //       .single();

      //     if (error) throw error;

      //     const newChild: Child = {
      //       ...childRow,
      //       registeredGames: [],
      //       scores: [],
      //     };

      //     console.log(`⚡ Parent id ${parentId}. checking registration...`);

      //     // Fetch if parent is already registered to any event
      //     const { data: registrations, error: regError } = await supabase
      //       .from("event_game_registration")
      //       .select("event_id")
      //       .eq("user_id", parentId)
      //       .limit(1);

      //     if (regError) {
      //       if (regError.code === "PGRST116") {
      //         // No rows — parent not registered yet
      //       } else {
      //         throw regError;
      //       }
      //     }

      //     const firstRegistration = registrations?.[0];

      //     if (firstRegistration) {
      //       console.log(
      //         `⚡ Parent registered to event ${firstRegistration.event_id}. Registering child...`
      //       );

      //       const rpcResult = await supabase.rpc("register_child_for_event", {
      //         p_event_id: firstRegistration.event_id,
      //         p_parent_id: parentId,
      //         p_child_id: childRow.id,
      //         p_division_name: childRow.division,
      //       });

      //       if (rpcResult.error) {
      //         console.error(
      //           "Error calling register_child_for_event:",
      //           rpcResult.error
      //         );
      //       }
      //     } else {
      //       console.log(
      //         "ℹ️ Parent not registered yet, skipping child game registration."
      //       );
      //     }

      //     set({ children: [...get().children, newChild], isLoading: false });
      //     return true;
      //   } catch (error) {
      //     console.error("Error when adding child:", error);
      //     set({ isLoading: false });
      //     return false;
      //   }
      // },

      updateChild: async (childId, childData) => {
        set({ isLoading: true });

        try {
          const updatedChildren = get().children.map((child) =>
            child.id === childId ? { ...child, ...childData } : child
          );

          set({ children: updatedChildren, isLoading: false });
          return true;
        } catch (error) {
          console.error("Error updating child:", error);
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "children-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
