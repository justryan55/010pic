"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/createSupabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/");
      } else {
        console.error("OAuth callback failed", error);
        router.push("/auth/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/images/spinner-black.svg"
        width={20}
        height={20}
        alt="Loading spinner"
      />
    </div>
  );
}
