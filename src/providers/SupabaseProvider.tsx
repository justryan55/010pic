"use client";

import { supabase } from "@/lib/supabase/createSupabaseClient";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

const SupabaseContext = createContext<Session | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoaded(true);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!loaded) return null;

  return (
    <SupabaseContext.Provider value={session}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseSession() {
  return useContext(SupabaseContext);
}
