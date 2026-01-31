import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables, Database, Enums, TablesInsert } from "./_database.types";

export type ChartType = Enums<"chart_type">;

export type ChartConfigFilterType = {
  property?: string;
  type?: string;
  operator?: string;
  value?: string | number | boolean;
};

export type ChartConfigFilterGroupType = {
  and?: (ChartConfigFilterGroupType | ChartConfigFilterType)[];
  or?: (ChartConfigFilterGroupType | ChartConfigFilterType)[];
};

export type ChartConfig = {
  joins: {
    from: string;
    to: string;
  }[];
  filters: ChartConfigFilterGroupType;
  axis: {
    x: {
      property: string;
    };
    y: {
      property: string;
      aggregation: "none" | "count" | "sum" | "average" | "min" | "max";
    }[];
  };
  sort?: {
    property: string;
    ascending: boolean;
  };
  limit?: number;
  cache: {
    duration: number;
  };
  customization: {
    theme: string;
  };
};

export type Chart = Tables<"charts"> & {
  config: ChartConfig;
};

export const DEFAULT_CHART_CONFIG_CACHE_DURATION = 3600; // 1 hour
export const DEFAULT_CHART_CONFIG_LIMIT = 1000;
export const DEFAULT_CHART_CONFIG_THEME = "green";

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
        return { ...res, data: res.data as Chart[] };
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
