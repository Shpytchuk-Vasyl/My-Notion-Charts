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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, routing } from "@/i18n/routing";

const CHART_DISPLAY_LIMIT = 10;

export function NavCharts({
  charts,
}: {
  charts: {
    name: string;
    id: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Charts</SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuAction className="static">
              <Plus />
              <span className="sr-only">Add new chart</span>
            </SidebarMenuAction>
          </TooltipTrigger>
          <TooltipContent side="top">Add new chart</TooltipContent>
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
            <DropdownOptions isMobile={isMobile} chartId={item.id} />
          </SidebarMenuItem>
        ))}
        {charts.length > CHART_DISPLAY_LIMIT && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={routing.pathnames["/chart/all"]}>
                <MoreHorizontal />
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const DropdownOptions = ({
  isMobile,
  chartId,
}: {
  isMobile: boolean;
  chartId: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <SidebarMenuAction showOnHover>
        <MoreHorizontal />
        <span className="sr-only">More</span>
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
          <span>Edit</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Share className="text-muted-foreground" />
        <span>Share</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Trash2 className="text-muted-foreground" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
