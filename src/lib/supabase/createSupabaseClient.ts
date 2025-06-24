"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to set localStorage item "${key}":`, error);
  }
}

function safeRemoveItem(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage item "${key}":`, error);
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  if (session?.provider_token) {
    safeSetItem("oauth_provider_token", session.provider_token);
  }

  if (session?.provider_refresh_token) {
    safeSetItem("oauth_provider_refresh_token", session.provider_refresh_token);
  }

  if (event === "SIGNED_OUT") {
    safeRemoveItem("oauth_provider_token");
    safeRemoveItem("oauth_provider_refresh_token");
  }
});

export { supabase };
