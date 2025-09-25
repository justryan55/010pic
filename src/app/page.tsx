"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/createSupabaseClient";

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          router.replace("/auth");
          setIsLoading(false);
          return;
        }

        if (!session) {
          router.replace("/auth");
          setIsLoading(false);
          return;
        }

        const isOnline = navigator.onLine;

        if (isOnline) {
          const userId = session.user.id;
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("is_deleted")
            .eq("id", userId)
            .single();

          if (profileError) {
            console.error("Profile error:", profileError);
            if (profileError.code !== "PGRST116") {
              router.replace("/date");
              setIsLoading(false);
              return;
            }
          }

          if (profile?.is_deleted) {
            await supabase.auth.signOut();
            router.replace("/auth");
            setIsLoading(false);
            return;
          }
        }

        router.replace("/date");
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace("/date");
        } else {
          router.replace("/auth");
        }
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <Image
          src="/images/spinner-black.svg"
          width={20}
          height={20}
          alt="Loading spinner"
        />
      </div>
    );
  }

  return null;
}
