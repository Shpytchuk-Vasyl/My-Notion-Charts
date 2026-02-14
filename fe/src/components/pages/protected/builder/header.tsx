"use client";

import { Sparkles } from "lucide-react";
import { SiteBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBuilderContext } from "./context";
import { Skeleton } from "@/components/ui/skeleton";
import { routing } from "@/i18n/routing";
import { usePathname } from "next/navigation";

type AppHeaderProps = {
  translations: {
    save: string;
    dashboard: string;
    edit: string;
  };
};

export function AppHeader({
  translations: { save, dashboard, edit },
}: AppHeaderProps) {
  const { isLoading, refresh, name } = useBuilderContext();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b h-(--header-height) gap-2 px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <SiteBreadcrumb
        list={[
          {
            title: dashboard,
            url: routing.pathnames["/dashboard"],
          },
          {
            title: name || <Skeleton className="h-8 w-32" />,
            url: `/${pathname.split("/").slice(2, -1).join("/")}`,
          },
          { title: edit, url: "#" },
        ]}
      />
      <Button
        className="w-full sm:ml-auto sm:w-auto"
        onClick={refresh}
        disabled={isLoading}
      >
        {save}
      </Button>
      <Button variant="ghost" size="icon" id="chat-sidebar-trigger" disabled>
        <Sparkles />
      </Button>
    </header>
  );
}
