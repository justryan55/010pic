"use client";

import { useEffect } from "react";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { PageProvider } from "@/providers/PageProvider";
import { SubscriptionSync } from "@/components/SubscriptionSync";
import { Instrument_Sans, Inria_Serif } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/providers/SupabaseProvider";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inria",
});

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function setupStatusBar() {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setStyle({ style: Style.Light });
        } catch (error) {
          console.warn("StatusBar setup failed", error);
        }
      }
    }

    setupStatusBar();
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        Keyboard.setResizeMode({ mode: "body" as KeyboardResize });
      } catch (error) {
        console.warn("Keyboard.setResizeMode not available", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let showListener: PluginListenerHandle | undefined;
    let hideListener: PluginListenerHandle | undefined;
    let isCancelled = false;

    const addListeners = async () => {
      if (isCancelled) return;

      showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        document.body.style.paddingBottom = "0px";
      });
    };

    addListeners();

    return () => {
      isCancelled = true;
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  return (
    <html lang="en">
      <SupabaseProvider>
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
      </SupabaseProvider>
    </html>
  );
}
