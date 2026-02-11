"use client";

import { Sparkles } from "lucide-react";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/routing";
import { useBuilderContext } from "./context";

export function AppHeader() {
  const { isLoading, refresh } = useBuilderContext();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <SiteBreadcrumb />
        <Button
          className="w-full sm:ml-auto sm:w-auto"
          onClick={refresh}
          disabled={isLoading}
        >
          Save
        </Button>
        <Button variant="ghost" size="icon" id="chat-sidebar-trigger" disabled>
          <Sparkles />
        </Button>
      </div>
    </header>
  );
}

const SiteBreadcrumb = () => {
  const pathname = usePathname();

  const breadcrumbs: any[] = [];

  // Simple breadcrumb generation based on pathname

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={`breadcrumb-${index}`}>
            <BreadcrumbItem>
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink href={breadcrumb.url}>
                  {breadcrumb.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="last:hidden" />
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
