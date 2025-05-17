import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxoyryhstaeabhhnwrct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4b3lyeWhzdGFlYWJoaG53cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzI0NTgsImV4cCI6MjA2MDc0ODQ1OH0.kiczjTuJcsMx_OqULJrm_PEfUHRKGKsgc89xya7eBk8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true, // keep sessions fresh
    detectSessionInUrl: false, // RN doesn’t handle URL fragments
  },
});
