import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables, Database } from "./_database.types";

export type Workspace = Tables<"workspaces"> & { isSelected?: boolean };
export type SelectedWorkspace = Tables<"selected_workspace">;

export class WorkspaceRepository {
  constructor(protected supabase: SupabaseClient<Database>) {}

  async getWorkspaces(userId: string) {
    const promisses = [
      this.supabase
        .from("workspaces")
        .select(
          "access_token, created_at, id, updated_at, user_id, workspace_icon, workspace_id, workspace_name",
        )
        .eq("user_id", userId),
      this.supabase
        .from("selected_workspace")
        .select("*")
        .eq("user_id", userId)
        .single(),
    ];

    const [workspacesResponse, selectedResponse] = await Promise.all(promisses);

    if (workspacesResponse.error || selectedResponse.error) {
      console.error(
        "Error fetching workspaces or selected workspace:",
        workspacesResponse.error || selectedResponse.error,
      );
      return {
        data: [],
        error: workspacesResponse.error || selectedResponse.error,
      };
    }

    const workspaces = workspacesResponse.data as Workspace[];
    const selectedWorkspace = selectedResponse.data as SelectedWorkspace;

    const result = workspaces.map((workspace) => ({
      ...workspace,
      isSelected: workspace.id === selectedWorkspace.workspace_id,
    }));

    return { data: result, error: null };
  }

  async deleteWorkspace(id: string) {
    return this.supabase.from("workspaces").delete().eq("id", id);
  }

  async addWorkspace(
    workspace: Omit<
      Workspace,
      "created_at" | "updated_at" | "id" | "isSelected"
    >,
  ) {
    const { data: existing } = await this.supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", workspace.user_id)
      .eq("workspace_id", workspace.workspace_id)
      .single();

    if (existing) {
      await this.supabase.from("workspaces").update({
        ...workspace,
        id: existing.id,
      });
    } else {
      return this.supabase.from("workspaces").insert(workspace);
    }
  }

  async setSelectedWorkspace(userId: string, workspaceId: string) {
    return this.supabase.from("selected_workspace").update({
      user_id: userId,
      workspace_id: workspaceId,
    });
  }

  async getSelectedWorkspace(userId: string) {
    return this.supabase
      .from("selected_workspace")
      .select(`
        *,
        workspace:workspaces!inner(*)
      `)
      .eq("user_id", userId)
      .single();
  }

  async setCurrentWorkspaceIfNotSet(userId: string, workspaces: Workspace[]) {
    if (workspaces.some((ws) => ws.isSelected) || workspaces.length === 0) {
      return;
    }

    await this.supabase.from("selected_workspace").update({
      user_id: userId,
      workspace_id: workspaces[0].id,
    });
  }
}
