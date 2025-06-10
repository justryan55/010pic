import "../../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-full bg-[var(--brand-bg)]">{children}</div>;
}
