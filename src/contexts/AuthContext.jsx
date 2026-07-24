import React, { createContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

// eslint-disable-next-line react/only-export-components -- Context must be exported for use in the companion useAuth.js hook
export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // profiles table row
  const [loading, setLoading] = useState(true);

  // Fetch user profile (plan, name, phone) from Supabase profiles table
  const fetchProfile = async (userId) => {
    if (!isSupabaseEnabled || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('[TrendVista] Could not fetch profile:', error.message);
      return null;
    }
    return data;
  };

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email + password, then create a profile row
  const signUp = async ({ email, password, fullName, phone }) => {
    if (!isSupabaseEnabled) return { error: { message: 'Demo mode: Supabase not configured.' } };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) return { error };

    // Upsert profile row on successful signup
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        phone: phone || '',
        plan: 'Free Plan',
      }, { onConflict: 'id' });
      if (profileError) console.warn('[TrendVista] Profile upsert warning:', profileError.message);
    }
    return { data, error: null };
  };

  // Sign in with email + password
  const signIn = async ({ email, password }) => {
    if (!isSupabaseEnabled) return { error: { message: 'Demo mode: Supabase not configured.' } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseEnabled) return;
    await supabase.auth.signOut();
  };

  // Update plan in profiles table (called after successful payment)
  const updatePlan = async (newPlan) => {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan })
      .eq('id', user.id);
    if (!error) {
      setProfile((prev) => ({ ...prev, plan: newPlan }));
    }
    return { error };
  };

  // Refresh profile from DB
  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!session,
    isSupabaseEnabled,
    signUp,
    signIn,
    signOut,
    updatePlan,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
