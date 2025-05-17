// utils/auth.ts
import { supabase } from "@/config/supabase";

export const getCurrentUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return data.session?.user?.id ?? null;
};
