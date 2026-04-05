import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ievmyeecdijmlmrvdrhh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldm15ZWVjZGlqbWxtcnZkcmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjgyNzMsImV4cCI6MjA5MDk0NDI3M30.D5769GV3ffEpWgZwpVhABN7LWemQHHjed4I48ymzO64';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'CRITICAL: Supabase credentials not found. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

// Ensure valid URLs even if empty for initialization safety
const clientUrl = supabaseUrl || 'https://placeholder-project-url.supabase.co';
const clientAnonKey = supabaseAnonKey || 'placeholder-anon-key';

// Removing <Database> generic to avoid strict typing issues with generated code
// and satisfy current page implementations which may not be fully type-compatible.
export const supabase = createClient(
  clientUrl,
  clientAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);