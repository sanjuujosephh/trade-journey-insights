
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://xgzordqukuahsmlhjvog.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnem9yZHF1a3VhaHNtbGhqdm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NTc5NjUsImV4cCI6MjAyNjEzMzk2NX0.8ZlPE5L9-Ie0R4L-H8gMecxScZOmatfVTNELMJsgT6o';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Network error during fetch:', err);
        throw new Error('Network connection error. Please check your internet connection and try again.');
      });
    }
  }
});
