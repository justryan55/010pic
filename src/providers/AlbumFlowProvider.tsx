"use client";

import AlbumFlow from "@/components/AlbumFlow/AlbumFlow";
import { createContext, useContext, useState } from "react";

type AlbumFlowContext = {
  isFlowOpen: boolean;
  toggleFlow: () => void;
};

const AlbumFlowContext = createContext<AlbumFlowContext>({
  isFlowOpen: false,
  toggleFlow: () => {},
});

export default function AlbumFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const toggleFlow = () => {
    setIsFlowOpen((prev) => !prev);
  };

  return (
    <AlbumFlowContext.Provider value={{ isFlowOpen, toggleFlow }}>
      {children}
      <AlbumFlow />
    </AlbumFlowContext.Provider>
  );
}

export const useAlbumFlow = () => {
  const context = useContext(AlbumFlowContext);
  if (!context) {
    throw new Error("useAlbumFlow must be used within an AlbumFlowProvider");
  }
  return context;
};
