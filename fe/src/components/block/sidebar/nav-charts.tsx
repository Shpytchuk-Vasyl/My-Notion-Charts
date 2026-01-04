"use client";

import { Folder, MoreHorizontal, Plus, Share, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChartIcon } from "../chart/icons";
import { Suspense, use } from "react";
import { useDashboardContext } from "@/pages/protected/dashboard/context";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_DISPLAY_LIMIT = 5;

export function NavCharts() {
  const t = useTranslations("pages.dashboard.charts.nav");

  return (
    <Suspense
      fallback={
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>{t("charts")}</SidebarGroupLabel>
          </div>
          <SidebarMenu>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </SidebarMenu>
        </SidebarGroup>
      }
    >
      <NavChartsInner />
    </Suspense>
  );
}

function NavChartsInner() {
  const { charts, currentWorkspace } = useDashboardContext();
  const chartsData = use(charts);
  const currentWorkspaceData = use(currentWorkspace);

  const t = useTranslations("pages.dashboard.charts.nav");

  if (!currentWorkspaceData) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>{t("charts")}</SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuAction className="static" asChild>
              <Link href={routing.pathnames["/dashboard/chart/new"]}>
                <Plus />
                <span className="sr-only">{t("addNewChart")}</span>
              </Link>
            </SidebarMenuAction>
          </TooltipTrigger>
          <TooltipContent side="top">{t("addNewChart")}</TooltipContent>
        </Tooltip>
      </div>
      <SidebarMenu>
        {chartsData.slice(0, CHART_DISPLAY_LIMIT).map((item, idx) => (
          <SidebarMenuItem key={item.name + idx}>
            <SidebarMenuButton asChild>
              <Link
                href={{
                  pathname: routing.pathnames["/chart/[chartId]"],
                  params: {
                    chartId: item.id,
                  },
                }}
              >
                <ChartIcon type={item.type} />
                <span title={item.name}>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownOptions chartId={item.id} />
          </SidebarMenuItem>
        ))}
        {chartsData.length > CHART_DISPLAY_LIMIT && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={routing.pathnames["/chart/all"]}>
                <MoreHorizontal />
                <span>{t("more")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const DropdownOptions = ({ chartId }: { chartId: string }) => {
  const { isMobile } = useSidebar();
  const t = useTranslations("pages.dashboard.charts.nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">{t("more")}</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: routing.pathnames["/chart/[chartId]/edit"],
              params: {
                chartId,
              },
            }}
          >
            <Folder />
            <span>{t("edit")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share />
          <span>{t("share")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Link
            href={{
              pathname: routing.pathnames["/dashboard/chart/[chartId]/delete"],
              params: {
                chartId,
              },
            }}
          >
            <Trash2 className="text-destructive" />
            <span>{t("delete")}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
