"use client";

import {
  Folder,
  GripVertical,
  MoreHorizontal,
  Plus,
  Share,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, use, useState } from "react";
import { ChartIcon } from "@/components/block/chart/icons";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, routing } from "@/i18n/routing";
import { useProtectedContext } from "@/pages/protected/context";

const CHART_DISPLAY_LIMIT = 5;

export function NavCharts() {
  const t = useTranslations("nav.charts");

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
  const { charts, currentWorkspace } = useProtectedContext();
  const chartsData = use(charts);
  const currentWorkspaceData = use(currentWorkspace);

  const t = useTranslations("nav.charts");
  const [displayedCharts, setDisplayedCharts] = useState(CHART_DISPLAY_LIMIT);

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
      <SidebarMenu data-tour-step-id="sidebar-charts">
        {chartsData.slice(0, displayedCharts).map((item) => (
          <SidebarMenuItem
            data-tour-step-id="sidebar-chart-item"
            key={`nav-charts-inner-item-${item.id}`}
            className="sidebar-draggable grid-stack-item cursor-grab active:cursor-grabbing"
            data-gs-widget={JSON.stringify({
              w: 1,
              h: 1,
              id: item.id,
              content: JSON.stringify({
                name: "GridChart",
                props: {
                  chart: {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                  },
                },
              }),
            })}
          >
            <SidebarMenuButton asChild className="flex-1">
              <Link
                href={{
                  pathname: routing.pathnames["/chart/[id]"],
                  params: {
                    id: item.id,
                  },
                }}
                draggable={false}
              >
                <ChartIcon type={item.type} />
                <span title={item.name}>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownOptions chartId={item.id} />
          </SidebarMenuItem>
        ))}
        {chartsData.length > displayedCharts && (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() =>
                setDisplayedCharts((prev) => prev + CHART_DISPLAY_LIMIT)
              }
            >
              <MoreHorizontal />
              <span>{t("more")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const DropdownOptions = ({ chartId }: { chartId: string }) => {
  const { isMobile } = useSidebar();
  const t = useTranslations("nav.charts");

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
              pathname: routing.pathnames["/chart/[id]/edit"],
              params: {
                id: chartId,
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
        <DropdownMenuItem variant="destructive" asChild>
          <Link
            href={{
              pathname: routing.pathnames["/dashboard/chart/[id]/delete"],
              params: {
                id: chartId,
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
