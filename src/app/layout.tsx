import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "O10P",
  description: "Remember only what matters",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
