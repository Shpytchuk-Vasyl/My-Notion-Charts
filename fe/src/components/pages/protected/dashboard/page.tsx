"use client";
import { use } from "react";
import { useDashboardContext } from "./context";
import { ChartGrid } from "./grid";

export function DashboardPage({
  addWorkspace,
  addChart,
}: {
  addWorkspace: React.ReactNode;
  addChart: React.ReactNode;
}) {
  const { workspaces, charts } = useDashboardContext();

  const workspacesData = use(workspaces);
  const chartsData = use(charts);

  if (workspacesData.length === 0) {
    return addWorkspace;
  }

  if (chartsData.length === 0) {
    return addChart;
  }

  return <ChartGrid charts={chartsData} />;
}
