"use client";

import {
  ChevronsUpDown,
  Folder,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import NextLink from "next/link";
import { Suspense, use, useTransition } from "react";
import { setWorkspaceAsCurrent } from "@/app/[locale]/(protected)/(general)/dashboard/actions";
import { AvatarInfo, AvatarInfoSckeleton } from "@/components/ui/avatar-info";
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
import { useTranslations } from "next-intl";
import { type Workspace } from "@/models/workspace";
import { useDashboardContext } from "@/pages/protected/general/dashboard/context";

type NavWorkspaceProps = {
  editable?: boolean;
};

export function NavWorkspace(props: NavWorkspaceProps) {
  return (
    <Suspense
      fallback={
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <AvatarInfoSckeleton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
    >
      <NavWorkspaceInner {...props} />
    </Suspense>
  );
}

function NavWorkspaceInner({ editable }: NavWorkspaceProps) {
  const { workspaces, currentWorkspace } = useDashboardContext();
  const [isPending, startTransition] = useTransition();

  const onSelectWorkspace = (workspaceId: string) => {
    startTransition(async () => {
      await setWorkspaceAsCurrent(workspaceId);
    });
  };

  const { isMobile } = useSidebar();

  const currentWorkspaceData = use(currentWorkspace);
  const workspacesData = use(workspaces);

  if (!currentWorkspaceData) {
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

  if (!editable) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <AvatarInfo
              title={currentWorkspaceData.workspace_name}
              description={currentWorkspaceData.workspace_email}
              url={currentWorkspaceData.workspace_icon}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

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
                title={currentWorkspaceData.workspace_name}
                description={currentWorkspaceData.workspace_email}
                url={currentWorkspaceData.workspace_icon}
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
            <Items
              workspaces={workspacesData}
              onSelectWorkspace={onSelectWorkspace}
              isPending={isPending}
            />
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

const Items = ({
  workspaces,
  onSelectWorkspace,
  isPending,
}: {
  workspaces: Workspace[];
  onSelectWorkspace: (workspaceId: string) => void;
  isPending: boolean;
}) => {
  return workspaces.map((workspace, index) => (
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
        title={workspace.workspace_name}
        description={workspace.workspace_email}
        url={workspace.workspace_icon}
      />
      <DropdownOptions
        workspaceId={workspace.id}
        workspaceName={workspace.workspace_name}
      />
    </DropdownMenuItem>
  ));
};

const DropdownOptions = ({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) => {
  const t = useTranslations("nav.workspace");

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
        <DropdownMenuItem asChild variant="destructive">
          <Link
            href={{
              pathname:
                routing.pathnames["/dashboard/workspace/[workspaceId]/delete"],
              params: {
                workspaceId,
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

const AddWorkspace = () => {
  const t = useTranslations("nav.workspace");

  return (
    <NextLink
      href={process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL || "#"}
      className="flex items-center gap-2"
    >
      <AvatarInfo
        title={t("addWorkspace")}
        description={""}
        icon={
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Plus />
          </div>
        }
      />
    </NextLink>
  );
};
