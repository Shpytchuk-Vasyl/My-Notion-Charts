import { createClient } from "@/lib/supabase/server";
import { type Chart, ChartRepository } from "@/models/chart";

export class ChartService {
  static async getChartsByWorkspace(workspaceId: string) {
    const supabase = await createClient();

    const { data: charts } = await new ChartRepository(
      supabase,
    ).getWorkspaceCharts(workspaceId);

    return { charts };
  }

  static async getChartById<Query extends string = "*">(
    chartId: string,
    fields?: Query,
  ) {
    const supabase = await createClient();

    const { data: chart, error } = await new ChartRepository(
      supabase,
    ).getChartById(chartId, fields);

    if (error) {
      throw error;
    }

    return chart;
  }

  static async getChartByIdWithWorkspace(chartId: string) {
    const supabase = await createClient();

    const { data, error } = await new ChartRepository(
      supabase,
    ).getChartByIdWithWorkspace(chartId);

    if (error) {
      throw error;
    }

    return data as Chart & { workspaces: { access_token: string } };
  }
}
