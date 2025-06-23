"use client";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
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
