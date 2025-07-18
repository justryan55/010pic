import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "O10P",
  description: "Remember only what matters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
