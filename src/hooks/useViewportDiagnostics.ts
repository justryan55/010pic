// hooks/useViewportDiagnostics.ts
"use client";

import { useEffect } from "react";

export function useViewportDiagnostics(labelPrefix = "") {
  useEffect(() => {
    const logViewport = (label: string) => {
      const safeAreaTop =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-inset-top"
        ) || "0px";
      const safeAreaBottom =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-inset-bottom"
        ) || "0px";

      console.log(`⚡️  [log] - 🔍 ${labelPrefix}${label}`);
      console.log("⚡️  [log] -   window.innerHeight:", window.innerHeight);
      console.log(
        "⚡️  [log] -   document.documentElement.clientHeight:",
        document.documentElement.clientHeight
      );
      console.log(
        "⚡️  [log] -   visualViewport?.height:",
        window.visualViewport?.height
      );
      console.log(
        "⚡️  [log] -   visualViewport?.offsetTop:",
        window.visualViewport?.offsetTop
      );
      console.log("⚡️  [log] -   safe-area-inset-top (CSS):", safeAreaTop);
      console.log(
        "⚡️  [log] -   safe-area-inset-bottom (CSS):",
        safeAreaBottom
      );
      console.log("⚡️  [log] -   -----------------------------");
    };

    const handleResize = () => logViewport("Resize Event");
    const handleFocus = () => {
      // Wait a bit in case layout is still catching up
      setTimeout(() => logViewport("Window Focused (e.g. after picker)"), 100);
    };

    logViewport("Initial Load");

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("focus", handleFocus);
    };
  }, [labelPrefix]);
}
