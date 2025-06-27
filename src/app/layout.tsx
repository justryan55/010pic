import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inria_Serif } from "next/font/google";
import "./globals.css";
import { PageProvider } from "@/providers/PageProvider";
import { SubscriptionSync } from "@/components/SubscriptionSync";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inria",
});

export const metadata: Metadata = {
  title: "O10P",
  description: "Remember only what matters",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PageProvider>
        <body
          className={`${instrumentSans.variable} ${inriaSerif.variable} flex justify-center w-full`}
        >
          <SubscriptionSync />
          <div className="h-screen w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl">
            {children}
          </div>
        </body>
      </PageProvider>
    </html>
  );
}
