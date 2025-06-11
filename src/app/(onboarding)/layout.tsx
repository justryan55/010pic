import { createSupabaseServer } from "@/lib/supabase/createSupabaseServer";
import "../globals.css";
import { redirect } from "next/navigation";
import { SupabaseProvider } from "@/providers/SupabaseProvider";

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
      <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] px-6 ">
        {children}
      </div>
    </SupabaseProvider>
  );
}

// <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] px-6">
//   <div className="flex-1">{children}</div>
//   <div className="pb-20">
//     <Button text="Next" />
//   </div>
// </div>
