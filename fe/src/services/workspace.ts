import { createClient } from "@/lib/supabase/server";
import { WorkspaceRepository } from "@/models/workspace";
import { UserService } from "./user";
import { forbidden } from "next/navigation";

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

  static async getWorkspaceById<Query extends string = "*">(
    id: string,
    fields?: Query,
  ) {
    const supabase = await createClient();
    const workspaceRepository = new WorkspaceRepository(supabase);
    const {
      data: workspace,
      error,
      status,
    } = await workspaceRepository.getWorkspaceById(id, fields);

    if (status === 403 || status === 406) {
      forbidden();
    }

    if (error) {
      throw error;
    }

    return workspace;
  }

  static async deleteWorkspace(workspaceId: string) {
    const supabase = await createClient();

    const repository = new WorkspaceRepository(supabase);

    const res = await repository.deleteWorkspace(workspaceId);
    if (res.status === 403) {
      forbidden();
    }
    return res;
  }
}
