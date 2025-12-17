"use client";

import { Workspace } from "@/models/workspace";
import React, { createContext, useContext } from "react";

interface DashboardContextType {
  workspaces: Workspace[];
  user: any;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({
  children,
  ...values
}: React.PropsWithChildren<DashboardContextType>) {
  return (
    <DashboardContext.Provider value={values}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within DashboardProvider",
    );
  }
  return context;
}
