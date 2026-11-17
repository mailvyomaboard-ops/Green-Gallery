"use client";

import React, { createContext, useContext } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: (initialProjectType?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalContext.Provider
      value={{
        isOpen: false,
        openModal: () => {},
        closeModal: () => {},
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useConsultationModal() {
  return useContext(ModalContext);
}
