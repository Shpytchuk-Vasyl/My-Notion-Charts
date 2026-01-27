import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables, Database, Enums, TablesInsert } from "./_database.types";

export type Chart = Tables<"charts">;
export type ChartType = Enums<"chart_type">;

type AvailableOperators =
  | "="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "starts_with"
  | "ends_with";
export type ChartConfig = {
  joins?: {
    from_id: string;
    to_id: string;
    table_id: string;
  }[];
  filters?: {
    [key in "and" | "or"]?: {
      operator: AvailableOperators;
      property: string;
      value: string;
    }[];
  };
  sort?: {
    property: string;
    ascending: boolean;
  };
  limit?: number;
  axis?: {
    [key in "x" | "y"]: {
      property: string;
      aggregation: "none" | "count" | "sum" | "average" | "min" | "max";
    }[];
  };
  cache?: {
    duration: number;
  };
};

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

  async getChartById(chartId: string) {
    return this.supabase.from("charts").select("*").eq("id", chartId).single();
  }

  async createChart(chart: TablesInsert<"charts">) {
    return this.supabase.from("charts").insert(chart).select().single();
  }

  async deleteChart(chartId: string) {
    return this.supabase.from("charts").delete().eq("id", chartId);
  }
}
