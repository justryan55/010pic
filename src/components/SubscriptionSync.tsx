"use client";

import { useRevenueCat } from "@/hooks/useRevenueCat";
import { useEffect } from "react";

export const SubscriptionSync = () => {
  const { refreshCustomerInfo } = useRevenueCat();
  useEffect(() => {
    const refresh = () => refreshCustomerInfo();

    const interval = setInterval(refresh, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });

    refresh();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
