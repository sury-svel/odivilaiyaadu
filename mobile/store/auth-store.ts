import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserRole } from "@/types/user";
import { supabase } from "@/config/supabase"; 
import i18n from "@/i18n";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  language: "en" | "ta";
  isLoading: boolean;
  error: string | null;
  authMode: "demo" | "supabase";
  
  currentUserRole: () => UserRole | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  setLanguage: (language: "en" | "ta") => void;
  clearError: () => void;
  fetchUser: () => Promise<void>;
  registerPushToken: (pushToken: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      language: "en",
      isLoading: false,
      error: null,
      authMode: "demo",
      

      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
      
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
          if (error || !data.user) {
            set({
              isLoading: false,
              error: error?.message || "Failed to sign in. Please check your credentials.",
            });
            return false;
          }
      
          // Fetch user profile from your user_profiles table
          const { data: profiles, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
      
          if (profileError || !profiles) {
            set({
              isLoading: false,
              error: profileError?.message || "User profile not found",
            });
            return false;
          }
      
          const user = {
            id: profiles.id,
            email: data.user.email,
            fullName: profiles.full_name, 
            role: profiles.role,
            address: profiles.address,
            phone: profiles.phone,
            language: profiles.language,
            agreedToSafety: profiles.agreed_to_safety,
            createdAt: profiles.created_at,
          } as User;
          
          // Set user and auth state
          set({
            isAuthenticated: true,
            user,
            isLoading: false,
            language: user.language || "en",
            authMode: "supabase",
          });
      
          // Update i18n language
          i18n.locale = user.language || "en";
      
          return true;
        } catch (err: any) {
          console.error("Supabase login error:", err);
          set({
            isLoading: false,
            error: "An unexpected error occurred during login.",
          });
          return false;
        }
      },
     
           
      register: async (userData, password) => {
        set({ isLoading: true, error: null });
      
        try {
          const { email, fullName, address, phone, role, agreedToSafety, language } = userData;
      
          if (!email || !password) {
            set({ isLoading: false, error: "Email and password are required" });
            return false;
          }

          //0: Check if the email already exists
          // const { data: existingUser, error } = await supabase
          //   .from("user_profiles")
          //   .select("email", { head: true, count: "exact" })
          //   .maybeSingle();

          const { count, error } = await supabase
            .from("user_profiles")
            .select("id", { head: true, count: "exact" })
            .eq("email", email);
          
          if (error) {
            console.error("Error checking existing user:", error.message);
            set({ isLoading: false, error: "Something went wrong. Please try again." });
            return false;
          }
          
          if ((count ?? 0) > 0) {
            set({ isLoading: false, error: "Email is already registered. Please log in instead." });
            return false;
          }
            
      
          // 1. Sign up using Supabase Auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: 'https://forms.zohopublic.com/avvaiyarpadasalai/form/2025CTOdiVilayaduRegistration/formperma/_307_Ca7My96CKK2btVxhcglNikwQYutE5qZoRFSl5c'
            }            
          });

     
          if (signUpError) {
            console.error("Supabase sign up error:", signUpError);
            set({ isLoading: false, error: signUpError.message });
            return false;
          }
      
          const userId = signUpData?.user?.id;
          if (!userId) {
            set({ isLoading: false, error: "Registration failed. Please try again." });
            return false;
          }

          await supabase.auth.getSession(); // Ensure session is active

          // 2. Insert profile into `user_profiles`
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: userId,
                email,
                full_name: fullName,
                address,
                phone,
                role: role || "parent",
                agreed_to_safety: agreedToSafety ?? false,
                language: language || "en",
                created_at: new Date().toISOString()
              }
            ]);
      
          if (insertError) {
            console.error("Supabase profile insert error again:", insertError);
            set({ isLoading: false, error: insertError.message });
            return false;
          }
      
          // 3. Success message
          set({
            isLoading: false,
            error: "Registration successful! Please check and confirm the email and login!"
          });
          return true;
      
        } catch (error: any) {
          console.error("Unexpected error during Supabase registration:", error);
          set({ isLoading: false, error: "An error occurred during registration" });
          return false;
        }
      },
      
      registerPushToken: async (pushToken: string) => {
        const user = get().user; // get user from store
        if (!user || !user.id) {
          console.error('No user in store. Cannot save push token.');
          return false;
        }

        console.log('Save/Update push token.');
      
        const { error } = await supabase
          .from('user_profiles')
          .update({ push_token: pushToken })
          .eq('id', user.id);  // use 'id' since user_profiles.id
      
        if (error) {
          console.error('Error saving push token:', error.message);
          return false;
        }
      
        return true;
      },
      
      logout: async () => {
        set({ isLoading: true });
      
        try {
          const { authMode } = get();
      
          if (authMode === "supabase") {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
          }
      
          // Clear auth state regardless of platform
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            authMode: "demo"
          });
        } catch (error) {
          console.error("Error during logout:", error);
      
          // Still reset local state on error
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            authMode: "demo"
          });
        }
      },
      
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
      
        try {
          const { user: currentUser } = get();
          if (!currentUser) {
            set({ isLoading: false, error: "No user is logged in" });
            return false;
          }
      
          // Update user_profiles table in Supabase
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update(userData)
            .eq("id", currentUser.id);
      
          if (updateError) {
            set({
              isLoading: false,
              error: updateError.message || "Failed to update user profile",
            });
            return false;
          }
      
          // Refresh local state with updated data
          const updatedUser = { ...currentUser, ...userData };
      
          set({
            user: updatedUser,
            isLoading: false,
            language: updatedUser.language || get().language,
          });
      
          // Update i18n language if needed
          if (userData.language) {
            i18n.locale = userData.language;
          }
      
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "An error occurred while updating profile",
          });
          return false;
        }
      },
      
      
      setLanguage: (language) => {
        i18n.locale = language;
        set({ language });
      
        const { user: currentUser, authMode } = get();
        if (!currentUser) return;
      
        const update = async () => {
          const { error } = await supabase
            .from("user_profiles")
            .update({ language })
            .eq("id", currentUser.id);
      
          if (error) {
            console.error("Error updating language in Supabase:", error);
          }
        };
      
        if (authMode === "supabase") {
          update();
        }
      
        set({
          user: {
            ...currentUser,
            language,
          },
        });
      },
      
      
      clearError: () => {
        set({ error: null });
      },


      fetchUser: async () => {
        console.log("auth store -> Inside fetchUser...");
        try {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();
      
          if (sessionError || !session?.user) {
             console.log("No authenticated Supabase session found");
            return;
          }
      
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
      
          if (profileError || !profile) {
            console.error("Error fetching user profile from Supabase:", profileError);
            return;
          }
      
          const user: User = {
            ...profile,
            email: session.user.email!,
          };
      
          set({
            isAuthenticated: true,
            user,
            language: user.language || "en",
            isLoading: false,
            authMode: "supabase",
          });
      
          // Set i18n locale
          i18n.locale = user.language || "en";
        } catch (error) {
          console.error("Error fetching Supabase user:", error);
          set({ isLoading: false });
        }
      },

      currentUserRole: () => {
        const { user } = get();
        return user?.role ?? null;
      },
      
    
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
