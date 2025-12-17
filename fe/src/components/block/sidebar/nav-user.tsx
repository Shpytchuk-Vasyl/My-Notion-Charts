"use client";
import { Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { AvatarInfo } from "@/components/ui/avatar-info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, routing } from "@/i18n/routing";
import { useDashboardContext } from "@/components/pages/protected/dashboard/context";
import { useTranslations } from "next-intl";

export function NavUser() {
  const { user } = useDashboardContext();
  const t = useTranslations("pages.dashboard.nav");
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AvatarInfo
                name={user.name}
                email={user.email || ""}
                avatar={user.avatar}
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 px-1 py-1.5 text-left text-sm font-normal">
              <AvatarInfo
                name={user.name}
                email={user.email || ""}
                avatar={user.avatar}
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                {t("notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routing.pathnames["/logout"]}>
                <LogOut />
                {t("logout")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
