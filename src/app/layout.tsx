import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "O10P",
  description: "Remember only what matters",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
