"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteWorkspace(workspaceId: string) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Delete workspace
    const { error: deleteError } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Delete workspace error:", deleteError);
      return { error: "Failed to delete workspace" };
    }

    // Clear selected_workspace if it was selected
    await supabase
      .from("selected_workspace")
      .update({ workspace_id: null })
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id);

    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Delete workspace error:", error);
    return { error: "An unexpected error occurred" };
  }
}
