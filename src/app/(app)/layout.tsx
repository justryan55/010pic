"use client";

import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import YearSelector from "@/components/YearSelector";
import SubscriptionProvider from "@/providers/SubscriptionProvider";
import PhotoFlowProvider from "@/providers/PhotoFlowProvider";
import AddPeoplePlaceBtn from "@/components/AddPeoplePlaceBtn";
import UserProvider from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Profile from "@/components/Profile";
import { supabase } from "@/lib/supabase/createSupabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!session) {
          router.replace("/auth/login");
        }
      }
    );

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
    <UserProvider>
      <SubscriptionProvider>
        <PhotoFlowProvider>
          <div className="flex flex-col min-h-screen bg-[var(--brand-bg)]">
            <div className={`sticky top-0 z-10 bg-[var(--brand-bg)] px-6`}>
              <Header />
              <YearSelector isOpen={isOpen} setIsOpen={setIsOpen} />
              <AddPeoplePlaceBtn />
            </div>
            <div className="flex-1 px-6">{children}</div>
            <BottomNav setIsOpen={setIsOpen} />
            <Profile />
          </div>
        </PhotoFlowProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}
