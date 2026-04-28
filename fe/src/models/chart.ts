import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums, Tables, TablesInsert } from "./_database.types";

export type ChartType = Enums<"chart_type">;

export type ChartConfigFilterType = {
  property?: string;
  type?: string;
  operator?: string;
  value?: string | number | boolean | string[];
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
      groupBy?: string;
    };
    y: {
      property: string;
      aggregation?: "count" | "sum" | "average" | "min" | "max";
      conversion?: "percentage" | "number";
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
export const DEFAULT_CHART_CONFIG_LIMIT = 100;
export const DEFAULT_CHART_CONFIG_THEME = "green";

export class ChartRepository {
  constructor(protected supabase: SupabaseClient<Database>) {}

  async getWorkspaceCharts(workspaceId: string) {
    return this.supabase
      .from("charts")
      .select(
        "databases,id,name,type,created_at,updated_at,workspace_id,is_public",
      )
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false });
  }

  async getChartById<Query extends string = "*">(
    chartId: string,
    fields: Query = "*" as Query,
  ) {
    return this.supabase
      .from("charts")
      .select(fields)
      .eq("id", chartId)
      .single();
  }

  async getChartByIdWithWorkspace(chartId: string) {
    return this.supabase
      .from("charts")
      .select("*, workspaces(access_token)")
      .eq("id", chartId)
      .single();
  }

  async createChart(chart: TablesInsert<"charts">) {
    return this.supabase.from("charts").insert(chart).select().single();
  }

  async deleteChart(chartId: string) {
    return this.supabase.from("charts").delete().eq("id", chartId);
  }

  async updateChart(chartId: string, chart: Partial<Tables<"charts">>) {
    return this.supabase
      .from("charts")
      .update(chart)
      .eq("id", chartId)
      .select()
      .single();
  }
}
