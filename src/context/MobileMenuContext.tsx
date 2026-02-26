"use client";

import { createContext, useContext, useState } from "react";

type MobileMenuContextValue = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextValue | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MobileMenuContext.Provider
      value={{
        isOpen,
        openMenu: () => setIsOpen(true),
        closeMenu: () => setIsOpen(false),
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) {
    return { isOpen: false, openMenu: () => {}, closeMenu: () => {} };
  }
  return ctx;
}
