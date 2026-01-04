"use client";

import { Chart } from "@/models/chart";
import { Workspace } from "@/models/workspace";
import { User } from "@/services/user";
import React, { createContext, useContext } from "react";

interface DashboardContextType {
  workspaces: Promise<Workspace[]>;
  currentWorkspace: Promise<Workspace | null>;
  user: Promise<User>;
  charts: Promise<Chart[]>;
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
