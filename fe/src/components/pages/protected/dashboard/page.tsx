"use client";
import { useDashboardContext } from "./context";

export function DashboardPage({
  addWorkspace,
  addChart
}: {
  addWorkspace: React.ReactNode;
  addChart: React.ReactNode;
}) {
  const { workspaces } = useDashboardContext();

  if (workspaces.length === 0) {
    return addWorkspace;
  }

 return addChart;
}
