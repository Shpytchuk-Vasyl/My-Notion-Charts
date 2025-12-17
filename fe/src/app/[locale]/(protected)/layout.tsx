import type { ReactNode } from "react";
import { SiteHeader } from "@/components/block/sidebar/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect, routing } from "@/i18n/routing";
import { DashboardProvider } from "@/components/pages/protected/dashboard/context";
import { getCachedWorkspaces } from "@/lib/supabase/workspace-cache";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  try {
    const { user, workspaces } = await getCachedWorkspaces();

    return (
      <SidebarProvider className="[--header-height:calc(--spacing(14))] flex flex-col">
        <SiteHeader />
        <DashboardProvider workspaces={workspaces} user={user}>
          <div className="flex flex-1">{children}</div>
        </DashboardProvider>
      </SidebarProvider>
    );
    
  } catch (error) {
    const { locale } = await params;
    redirect({
      locale,
      href: {
        pathname: routing.pathnames["/login"],
      },
    });
  }
  return null;
}
