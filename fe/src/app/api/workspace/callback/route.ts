import { Client } from "@notionhq/client";
import type SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient.js";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/user";
import { WorkspaceRepository } from "@/models/workspace";

const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID!;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET!;
const NOTION_REDIRECT_URI = new URL(
  process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL!,
).searchParams.get("redirect_uri")!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL(routing.pathnames["/dashboard"], request.url),
    );
  }

  try {
    const authClient = new Client();
    const tokenResponse = await authClient.oauth.token({
      grant_type: "authorization_code",
      code,
      redirect_uri: NOTION_REDIRECT_URI,
      client_id: NOTION_CLIENT_ID,
      client_secret: NOTION_CLIENT_SECRET,
    });

    const { user, supabase } = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const notionUser = (tokenResponse.owner as any)?.user;

    await new WorkspaceRepository(supabase).addWorkspace({
      user_id: user.id,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token || "",
      workspace_icon: tokenResponse.workspace_icon,
      workspace_id: tokenResponse.workspace_id,
      workspace_name: tokenResponse.workspace_name || "Unknown",
      workspace_email: notionUser?.person?.email || null,
    });

    await updateUserMetadata(user, notionUser, supabase);
  } catch (err) {
    console.error("Error during Notion OAuth Callback:", err);
  }
  return NextResponse.redirect(
    new URL(routing.pathnames["/dashboard"], request.url),
  );
}

async function updateUserMetadata(
  user: any,
  notionUser: any,
  supabase: SupabaseClient,
) {
  if (notionUser?.person?.email === user.email) {
    const newUserMetadata = { ...user.user_metadata };

    if (
      !(newUserMetadata.avatar_url || newUserMetadata.picture) &&
      notionUser?.avatar_url
    ) {
      newUserMetadata.avatar_url = notionUser.avatar_url;
    }

    if (
      !(newUserMetadata.name || newUserMetadata.full_name) &&
      notionUser?.name
    ) {
      newUserMetadata.name = notionUser.name;
    }

    await supabase.auth.updateUser({
      data: newUserMetadata,
    });
  }
}
