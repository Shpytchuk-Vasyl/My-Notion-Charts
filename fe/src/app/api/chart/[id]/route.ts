import { NextResponse } from "next/server";
import { ChartService } from "@/services/chart";

export const revalidate = 30;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const chart = await ChartService.getChartById((await params).id);

    return NextResponse.json(
      { chart },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to load chart." },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
