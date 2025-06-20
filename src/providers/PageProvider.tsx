"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PageContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const useCurrentPage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("useCurrentPage must be used within PageProvider");
  }
  return context;
};
