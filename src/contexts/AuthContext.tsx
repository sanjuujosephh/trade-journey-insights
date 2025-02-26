
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session initialization error:', error.message);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Critical auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);

      // Force page reload on sign out to clear any cached states
      if (event === 'SIGNED_OUT') {
        window.location.href = '/';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthError = (error: AuthError, action: string) => {
    console.error(`${action} error:`, error);
    if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      console.log('Sign in successful:', data.user?.email);
    } catch (error) {
      handleAuthError(error as AuthError, 'Sign in');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up:', email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      console.log('Sign up successful:', data.user?.email);
    } catch (error) {
      handleAuthError(error as AuthError, 'Sign up');
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Sign out successful');
    } catch (error) {
      handleAuthError(error as AuthError, 'Sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      console.log('Password reset email sent');
    } catch (error) {
      handleAuthError(error as AuthError, 'Password reset');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
