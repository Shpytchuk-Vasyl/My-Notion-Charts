import { NextResponse } from "next/server";
import { WorkspaceService } from "@/services/workspace";
import { NotionService } from "@/services/notion";

export const revalidate = 600;

export async function GET(_request: Request) {
  try {
    const workspace = await WorkspaceService.getCurrentWorkspace();

    if (!workspace) {
      return NextResponse.json(
        { databases: [], id: "" },
        {
          headers: {
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
          },
        },
      );
    }

    const databases = await new NotionService(
      workspace.access_token,
    ).getDatabases();

    return NextResponse.json(
      {
        databases,
        id: workspace.id,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to load databases." },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
