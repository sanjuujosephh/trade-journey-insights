
import { createClient } from "@supabase/supabase-js";

// Project URL from your Supabase dashboard
const supabaseUrl = 'https://xgzordqukuahsmlhjvog.supabase.co';
// Project anon/public key from your Supabase dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnem9yZHF1a3VhaHNtbGhqdm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NTc5NjUsImV4cCI6MjAyNjEzMzk2NX0.8ZlPE5L9-Ie0R4L-H8gMecxScZOmatfVTNELMJsgT6o';

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
