"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/createSupabaseClient";
import Image from "next/image";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Auth callback error:", userError);
          router.push("/auth/login?error=auth_failed");
          return;
        }

        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileError);
          router.push("/auth/login?error=profile_fetch_failed");
          return;
        }

        // If profile exists and is marked as deleted, reactivate it
        if (profile?.is_deleted) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              is_deleted: false,
              onboarding_complete: false, // Reset onboarding for reactivated accounts
            })
            .eq("id", user.id);

          if (updateError) {
            console.error("Profile reactivation error:", updateError);
            router.push("/auth/login?error=reactivation_failed");
            return;
          }

          // Redirect to onboarding for reactivated accounts
          router.push("/onboarding/");
          return;
        }

        // If no profile exists, create one (first time Google OAuth)
        if (!profile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              full_name:
                user.user_metadata?.full_name || user.user_metadata?.name || "",
              subscription_status: false,
              onboarding_complete: false,
              is_deleted: false,
            });

          if (insertError) {
            console.error("Profile creation error:", insertError);
            router.push("/auth/login?error=profile_creation_failed");
            return;
          }

          router.push("/onboarding/");
          return;
        }

        // Existing active user
        if (profile.onboarding_complete) {
          router.push("/date");
        } else {
          router.push("/onboarding/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login?error=callback_failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Image
          src="/images/spinner-black.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
      </div>
    </div>
  );
}
