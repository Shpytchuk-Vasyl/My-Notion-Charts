"use client";

import {
  Folder,
  type LucideIcon,
  MoreHorizontal,
  Plus,
  Share,
  Trash2,
} from "lucide-react";

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

const CHART_DISPLAY_LIMIT = 10;

export function NavCharts() {
  const charts: any[] = [];
  const t = useTranslations("pages.dashboard.charts.nav");


  if (charts.length === 0) {
    return null;
  }
  
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>{t("charts")}</SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuAction className="static">
              <Plus />
              <span className="sr-only">{t("addNewChart")}</span>
            </SidebarMenuAction>
          </TooltipTrigger>
          <TooltipContent side="top">{t("addNewChart")}</TooltipContent>
        </Tooltip>
      </div>
      <SidebarMenu>
        {charts.slice(0, CHART_DISPLAY_LIMIT).map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={{
                  pathname: routing.pathnames["/chart/[chartId]"],
                  params: {
                    chartId: item.id,
                  },
                }}
              >
                <item.icon />
                <span title={item.name}>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownOptions chartId={item.id} />
          </SidebarMenuItem>
        ))}
        {charts.length > CHART_DISPLAY_LIMIT && (
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
            <Folder className="text-muted-foreground" />
            <span>{t("edit")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share className="text-muted-foreground" />
          <span>{t("share")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 className="text-muted-foreground" />
          <span>{t("delete")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
