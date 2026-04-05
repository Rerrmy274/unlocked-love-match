import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchProfile = async (userId: string) => {
    try {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch warning:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id);
      if (mountedRef.current) setProfile(p);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Safety timeout: ensure loading is set to false even if Supabase init hangs
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("Auth initialization safety timeout reached.");
        setLoading(false);
      }
    }, 4000);

    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          if (mountedRef.current) setLoading(false);
          return;
        }

        if (mountedRef.current) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (mountedRef.current) setProfile(profileData);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Unexpected auth init error:", err);
        if (mountedRef.current) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mountedRef.current) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        const profileData = await fetchProfile(newSession.user.id);
        if (mountedRef.current) setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    signOut: async () => {
      try {
        await supabase.auth.signOut();
        if (mountedRef.current) {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Sign out error:", err);
      }
    },
    refreshProfile
  }), [user, session, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}