import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceService } from "@/services/workspace";
import { ChartService } from "@/services/chart";
import { DashboardProvider } from "@/pages/protected/general/dashboard/context";
import { SiteHeader } from "@/pages/protected/general/sidebar/site-header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const promises = WorkspaceService.getCachedWorkspaces();

  const user = promises.then(({ user }) => user);
  const workspaces = promises.then(({ workspaces }) => workspaces);
  const currentWorkspace = promises.then(
    ({ currentWorkspace }) => currentWorkspace,
  );
  const charts = currentWorkspace.then((currentWorkspace) => {
    if (!currentWorkspace) {
      return [];
    }
    return ChartService.getChartsByWorkspace(currentWorkspace.id).then(
      ({ charts }) => charts,
    );
  });

  return (
    <DashboardProvider
      workspaces={workspaces}
      currentWorkspace={currentWorkspace}
      user={user}
      charts={charts}
    >
      <SidebarProvider className="[--header-height:calc(--spacing(14))] flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">{children}</div>
      </SidebarProvider>
    </DashboardProvider>
  );
}
