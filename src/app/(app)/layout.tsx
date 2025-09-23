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
import { Capacitor } from "@capacitor/core";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [, setPlatform] = useState<"android" | "ios" | "web">("web");

  useEffect(() => {
    setPlatform(Capacitor.getPlatform() as "android" | "ios" | "web");
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth");
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
          router.replace("/auth");
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
            <div
              className={`sticky top-0 left-0 right-0 native-padding z-10 bg-[var(--brand-bg)] px-6 pt-3`}
            >
              <Header />
              <YearSelector isOpen={isOpen} setIsOpen={setIsOpen} />
              <AddPeoplePlaceBtn />
            </div>

            <div className={`flex-1 px-6`}>{children}</div>

            <BottomNav setIsOpen={setIsOpen} />
          </div>
          <Profile />
        </PhotoFlowProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}
