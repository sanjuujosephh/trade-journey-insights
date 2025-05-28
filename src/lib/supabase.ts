
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://fyiyuqpcxjwxingjgpiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5aXl1cXBjeGp3eGluZ2pncGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzMwNDYsImV4cCI6MjA1NTQ0OTA0Nn0.oaOKB7e6oSTTYIgQHGSsM2N6L1kdVdf3_jT7MXVfSUo';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
