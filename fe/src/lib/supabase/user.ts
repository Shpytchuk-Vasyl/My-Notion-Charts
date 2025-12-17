import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./server";

export type User = {
  id: string;
  email: string | null;
  name: string;
  user_metadata: Record<string, any>;
  avatar: string | null;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user logged in");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0],
      user_metadata: user.user_metadata,
      avatar:
        user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    } as User,
    supabase,
  };
}

export async function updateUserMetadata(
  user: any,
  user_metadata: {
    name?: string;
    avatar?: string;
  },
  supabase: SupabaseClient,
) {
  const newUserMetadata = { ...user.user_metadata };

  if (
    !(newUserMetadata.avatar_url || newUserMetadata.picture) &&
    user_metadata.avatar
  ) {
    newUserMetadata.avatar_url = user_metadata.avatar;
  }

  if (
    !(newUserMetadata.name || newUserMetadata.full_name) &&
    user_metadata.name
  ) {
    newUserMetadata.name = user_metadata.name;
  }

  await supabase.auth.updateUser({
    data: newUserMetadata,
  });
}
