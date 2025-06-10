import "../globals.css";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] px-6 ">
      {children}
    </div>
  );
}

// <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] px-6">
//   <div className="flex-1">{children}</div>
//   <div className="pb-20">
//     <Button text="Next" />
//   </div>
// </div>
