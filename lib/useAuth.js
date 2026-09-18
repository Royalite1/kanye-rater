"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

// Keeps the current auth user + their profile row (username) in sync.
// Also makes sure a `profiles` row exists the first time someone logs in,
// in case the DB trigger didn't fire for some reason.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!data && !error) {
      const fallbackUsername =
        currentUser.user_metadata?.username ||
        currentUser.email?.split("@")[0] ||
        `user_${currentUser.id.slice(0, 6)}`;

      const { data: created } = await supabase
        .from("profiles")
        .insert({ id: currentUser.id, username: fallbackUsername })
        .select()
        .maybeSingle();
      data = created;
    }
    setProfile(data || null);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      loadProfile(currentUser).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        loadProfile(currentUser);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, profile, loading, signOut };
}
