import BottomNav from "@/components/HomePage/BottomNav";
import "../globals.css";
import Header from "@/components/HomePage/Header";
import YearSelector from "@/components/HomePage/YearSelector";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--brand-bg)]">
      <div className={`sticky top-0 z-10 bg-[var(--brand-bg)] px-6`}>
        <Header />
        <YearSelector />
      </div>
      <div className="flex-1 px-6">{children}</div>
      <BottomNav />
    </div>
  );
}
