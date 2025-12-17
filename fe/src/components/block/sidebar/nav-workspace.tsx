"use client";

import {
  ChevronsUpDown,
  Folder,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import NextLink from "next/link";
import { useTransition } from "react";
import { setWorkspaceAsCurrent } from "@/app/[locale]/(protected)/(general)/dashboard/actions";
import { AvatarInfo } from "@/components/ui/avatar-info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, routing } from "@/i18n/routing";
import { useDashboardContext } from "@/components/pages/protected/dashboard/context";
import { useTranslations } from "next-intl";

export function NavWorkspace() {
  const { workspaces } = useDashboardContext();

  const [isPending, startTransition] = useTransition();

  const onSelectWorkspace = (workspaceId: string) => {
    startTransition(async () => {
      await setWorkspaceAsCurrent(workspaceId);
    });
  };

  const { isMobile } = useSidebar();

  if (workspaces.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <AddWorkspace />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const currentWorkspace =
    workspaces.find((ws) => ws.isSelected) || workspaces[0];

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
                name={currentWorkspace.workspace_name}
                email={currentWorkspace.workspace_email}
                avatar={currentWorkspace.workspace_icon}
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "start" : "end"}
            sideOffset={4}
          >
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={`workspace-${index}`}
                className="p-0 font-normal flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                onSelect={(event) => {
                  event.preventDefault();
                  onSelectWorkspace(workspace.id);
                }}
                disabled={isPending}
              >
                <AvatarInfo
                  name={workspace.workspace_name}
                  email={workspace.workspace_email}
                  avatar={workspace.workspace_icon}
                />
                <DropdownOptions workspaceId={workspace.id} />
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isPending}
              className="p-0 font-normal px-1 py-1.5"
            >
              <AddWorkspace />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const DropdownOptions = ({ workspaceId }: { workspaceId: string }) => {
  const t = useTranslations("pages.dashboard.workspace.nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className="static">
          <MoreHorizontal />
          <span className="sr-only">{t("more")}</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" side={"right"} align={"start"}>
        <DropdownMenuItem asChild>
          <NextLink href={process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL!}>
            <Folder className="text-muted-foreground" />
            <span>{t("edit")}</span>
          </NextLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname:
                routing.pathnames["/dashboard/workspace/[workspaceId]/delete"],
              params: {
                workspaceId,
              },
            }}
          >
            <Trash2 className="text-muted-foreground" />
            <span>{t("delete")}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AddWorkspace = () => {
  const t = useTranslations("pages.dashboard.workspace.nav");

  return (
    <NextLink
      href={process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL || "#"}
      className="flex items-center gap-2"
    >
      <AvatarInfo
        name={t("addWorkspace")}
        email={""}
        icon={
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Plus className="size-4" />
          </div>
        }
      />
    </NextLink>
  );
};
