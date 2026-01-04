import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables, Database, Enums, TablesInsert } from "./_database.types";

export type Chart = Tables<"charts">;
export type ChartType = Enums<"chart_type">;

export class ChartRepository {
  constructor(protected supabase: SupabaseClient<Database>) {}

  async getWorkspaceCharts(workspaceId: string) {
    return this.supabase
      .from("charts")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false })
      .then((res) => {
        if (res.error) {
          return { data: [], error: res.error };
        }
        return res;
      });
  }

  async createChart(chart: TablesInsert<"charts">) {
    return this.supabase.from("charts").insert(chart).select().single();
  }

  async deleteChart(chartId: string) {
    return this.supabase.from("charts").delete().eq("id", chartId);
  }
}
