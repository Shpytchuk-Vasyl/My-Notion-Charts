"use server";

import { getLocale } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { WorkspaceRepository } from "@/models/workspace";

export async function deleteWorkspace(workspaceId: string) {
  const supabase = await createClient();

  const repository = new WorkspaceRepository(supabase);

  const { error } = await repository.deleteWorkspace(workspaceId);

  if (error) {
    return { success: false, msg: error.message };
  }
  return { success: true };
}

export async function setWorkspaceAsCurrent(workspaceId: string) {
  const { user, supabase } = await getCurrentUser();

  const repository = new WorkspaceRepository(supabase);

  await repository.setSelectedWorkspace(user.id, workspaceId);

  const locale = await getLocale();

  redirect({
    locale,
    href: {
      pathname: routing.pathnames["/dashboard"],
    },
  });
}
