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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/login");
        setIsLoading(false);
        return;
      }

      const userId = session.user.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_deleted")
        .eq("id", userId)
        .single();

      if (profileError || profile?.is_deleted) {
        await supabase.auth.signOut();
        router.replace("/auth/login");
        setIsLoading(false);
        return;
      }

      router.replace("/date");
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace("/auth/login");
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
