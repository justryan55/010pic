"use client";

import BottomNav from "@/components/BottomNav";
import "../globals.css";
import Header from "@/components/Header";
import YearSelector from "@/components/YearSelector";
import SubscriptionProvider from "@/providers/SubscriptionProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import PhotoFlowProvider from "@/providers/PhotoFlowProvider";
import AddPeoplePlaceBtn from "@/components/AddPeoplePlaceBtn";
import UserProvider from "@/providers/UserProvider";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Profile from "@/components/Profile";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <SupabaseProvider>
      <UserProvider>
        <SubscriptionProvider>
          <PhotoFlowProvider>
            <div className="flex flex-col min-h-screen bg-[var(--brand-bg)]">
              <div className={`sticky top-0 z-10 bg-[var(--brand-bg)] px-6`}>
                <Header />
                <YearSelector />
                <AddPeoplePlaceBtn />
              </div>
              <div className="flex-1 px-6">{children}</div>
              <BottomNav />
              <Profile />
            </div>
          </PhotoFlowProvider>
        </SubscriptionProvider>
      </UserProvider>
    </SupabaseProvider>
  );
}
