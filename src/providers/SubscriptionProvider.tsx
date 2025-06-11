"use client";

import Subscription from "@/components/Subscription";
import React, { createContext, useContext, useState } from "react";

type SubscriptionContextType = {
  isSubOpen: boolean;
  toggleSubscription: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export default function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  const toggleSubscription = () => {
    setIsSubOpen((prev) => !prev);
  };

  return (
    <SubscriptionContext.Provider value={{ isSubOpen, toggleSubscription }}>
      {children}
      <Subscription />
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
