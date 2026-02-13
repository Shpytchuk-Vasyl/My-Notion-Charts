"use client";

import { createContext, useContext } from "react";
import type { Chart } from "@/models/chart";
import type { Workspace } from "@/models/workspace";
import type { User } from "@/services/user";

interface ProtectedContextType {
  workspaces: Promise<Workspace[]>;
  currentWorkspace: Promise<Workspace | null>;
  user: Promise<User>;
  charts: Promise<Omit<Chart, "config">[]>;
}

const ProtectedContext = createContext<ProtectedContextType | undefined>(
  undefined,
);

export function ProtectedProvider({
  children,
  ...values
}: React.PropsWithChildren<ProtectedContextType>) {
  return (
    <ProtectedContext.Provider value={values}>
      {children}
    </ProtectedContext.Provider>
  );
}

export function useProtectedContext() {
  const context = useContext(ProtectedContext);
  if (context === undefined) {
    throw new Error(
      "useProtectedContext must be used within ProtectedProvider",
    );
  }
  return context;
}
