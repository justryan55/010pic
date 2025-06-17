import BottomNav from "@/components/BottomNav";
import "../globals.css";
import Header from "@/components/Header";
import YearSelector from "@/components/YearSelector";
import SubscriptionProvider from "@/providers/SubscriptionProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { createSupabaseServer } from "@/lib/supabase/createSupabaseServer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { redirect } from "next/navigation";
import PhotoFlowProvider from "@/providers/PhotoFlowProvider";
import AddPeoplePlaceBtn from "@/components/AddPeoplePlaceBtn";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  return (
    <SupabaseProvider>
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
          </div>
        </PhotoFlowProvider>
      </SubscriptionProvider>
    </SupabaseProvider>
  );
}
