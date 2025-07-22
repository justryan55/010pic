"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/createSupabaseClient";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/login");
        return;
      }

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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] px-6 ">
      {children}
    </div>
  );
}
