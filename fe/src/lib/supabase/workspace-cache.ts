import { cache } from "react";
import { getCurrentUser } from "./user";
import { WorkspaceRepository } from "@/models/workspace";

export const getCachedWorkspaces = cache(async () => {
  const { user, supabase } = await getCurrentUser();
  const repository = new WorkspaceRepository(supabase);
  const { data: workspaces } = await repository.getWorkspaces(user.id);
  await repository.setCurrentWorkspaceIfNotSet(user.id, workspaces);

  return { workspaces, user, supabase };
});
