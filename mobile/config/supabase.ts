import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. ' +
    'Copy .env.example to .env and fill in your project credentials.'
  );
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true, // keep sessions fresh
    detectSessionInUrl: false, // RN doesn’t handle URL fragments
  },
});
