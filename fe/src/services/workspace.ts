import { Workspace, WorkspaceRepository } from "@/models/workspace";
import { UserService } from "./user";
import { createClient } from "@/lib/supabase/server";

export class WorkspaceService {
  static async getCachedWorkspaces() {
    const { user, supabase } = await UserService.getCurrentUser();
    const workspaceRepository = new WorkspaceRepository(supabase);

    const { data: workspaces } = await workspaceRepository.getWorkspaces(
      user.id,
    );
    await workspaceRepository.setCurrentWorkspaceIfNotSet(user.id, workspaces);

    const currentWorkspace =
      workspaces.find((ws) => ws.isSelected) || workspaces?.[0];

    return { workspaces, user, supabase, currentWorkspace };
  }

  static async getCurrentWorkspace() {
    const { user, supabase } = await UserService.getCurrentUser();
    const workspaceRepository = new WorkspaceRepository(supabase);

    const { data: workspace } = await workspaceRepository.getSelectedWorkspace(
      user.id,
    );

    return workspace?.workspace || null;
  }

  static async getWorkspaceById(id: string) {
    const supabase = await createClient();
    const workspaceRepository = new WorkspaceRepository(supabase);
    const { data: workspace, error } =
      await workspaceRepository.getWorkspaceById(id);

    if (error) {
      throw error;
    }

    return workspace as Workspace;
  }
}
