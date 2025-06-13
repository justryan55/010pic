/* eslint-disable @typescript-eslint/no-unused-vars */
import BottomNav from "@/components/HomePage/BottomNav";
import "../globals.css";
import Header from "@/components/HomePage/Header";
import YearSelector from "@/components/HomePage/YearSelector";
import SubscriptionProvider from "@/providers/SubscriptionProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { createSupabaseServer } from "@/lib/supabase/createSupabaseServer";
import { redirect } from "next/navigation";
import PhotoFlowProvider from "@/providers/PhotoFlowProvider";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect("/auth/login");
  // }
  return (
    <SupabaseProvider>
      <SubscriptionProvider>
        <PhotoFlowProvider>
          <div className="flex flex-col min-h-screen bg-[var(--brand-bg)]">
            <div className={`sticky top-0 z-10 bg-[var(--brand-bg)] px-6`}>
              <Header />
              <YearSelector />
            </div>
            <div className="flex-1 px-6">{children}</div>
            <BottomNav />
          </div>
        </PhotoFlowProvider>
      </SubscriptionProvider>
    </SupabaseProvider>
  );
}
