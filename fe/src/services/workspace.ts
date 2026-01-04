import { cache } from "react";
import { WorkspaceRepository } from "@/models/workspace";
import { ChartRepository } from "@/models/chart";
import { UserService } from "./user";

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

    console.log("WORKSPACES CACHE HIT");

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
}
