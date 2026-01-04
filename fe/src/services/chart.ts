import { ChartRepository } from "@/models/chart";
import { createClient } from "@/lib/supabase/server";

export class ChartService {
  static async getChartsByWorkspace(workspaceId: string) {
    const supabase = await createClient();

    const { data: charts } = await new ChartRepository(
      supabase,
    ).getWorkspaceCharts(workspaceId);

    return { charts };
  }
}
