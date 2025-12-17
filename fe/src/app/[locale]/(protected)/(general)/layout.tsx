import { AppSidebar } from "@/components/block/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/supabase/user";
import { WorkspaceRepository } from "@/models/workspace";

export default async function GeneralLayout({
  children,
  modal,
}: React.PropsWithChildren<{ modal?: React.ReactNode }>) {
  const { user, supabase } = await getCurrentUser();
  const repository = new WorkspaceRepository(supabase);
  const { data: workspaces } = await repository.getWorkspaces(user.id);
  await repository.setCurrentWorkspaceIfNotSet(user.id, workspaces);

  return (
    <>
      <AppSidebar user={user} workspaces={workspaces} />
      <SidebarInset>
        {children}
        {modal}
      </SidebarInset>
    </>
  );
}
