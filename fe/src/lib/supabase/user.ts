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
