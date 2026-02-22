import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
  type Chart,
  ChartRepository,
  DEFAULT_CHART_CONFIG_CACHE_DURATION,
  DEFAULT_CHART_CONFIG_LIMIT,
  DEFAULT_CHART_CONFIG_THEME,
} from "@/models/chart";
import {
  type ChartUpdateSchemaType,
  type ChartCreateSchemaType,
} from "@/zod-schemas/chart";
import { forbidden } from "next/navigation";

export class ChartService {
  static async getChartsByWorkspace(workspaceId: string) {
    const supabase = await createClient();

    const { data: charts, status } = await new ChartRepository(
      supabase,
    ).getWorkspaceCharts(workspaceId);

    if (status === 403 || status === 406) {
      forbidden();
    }

    return { charts };
  }

  static async getChartById<Query extends string = "*">(
    chartId: string,
    fields?: Query,
  ) {
    const supabase = await createClient();

    const {
      data: chart,
      error,
      status,
    } = await new ChartRepository(supabase).getChartById(chartId, fields);

    if (status === 403 || status === 406) {
      forbidden();
    }

    if (error) {
      throw error;
    }

    return chart;
  }

  static async getChartByIdWithWorkspace(chartId: string) {
    const supabase = await createClient();

    const { data, error, status } = await new ChartRepository(
      supabase,
    ).getChartByIdWithWorkspace(chartId);

    if (status === 403 || status === 406) {
      forbidden();
    }

    if (error) {
      throw error;
    }

    return data as Chart & { workspaces: { access_token: string } };
  }

  static async getOpenChartByIdWithWorkspace(chartId: string) {
    const supabase = await createAdminClient();

    const { data, error } = await new ChartRepository(
      supabase,
    ).getChartByIdWithWorkspace(chartId);

    if (error) {
      throw error;
    }

    return data as Chart & { workspaces: { access_token: string } };
  }

  static async createChart(values: ChartCreateSchemaType) {
    const supabase = await createClient();
    const repository = new ChartRepository(supabase);

    const res = await repository.createChart({
      name: values.chartName,
      workspace_id: values.workspaceId,
      databases: values.databases,
      type: values.chartType,
      config: {
        axis: {
          x: {
            property: "",
          },
          y: [
            {
              property: "",
            },
          ],
        },
        joins: values.joins,
        filters: {},
        limit: DEFAULT_CHART_CONFIG_LIMIT,
        sort: undefined,
        cache: {
          duration: DEFAULT_CHART_CONFIG_CACHE_DURATION,
        },
        customization: {
          theme: DEFAULT_CHART_CONFIG_THEME,
        },
      } as Chart["config"],
    });
    if (res.status === 403) {
      forbidden();
    }
    return res;
  }

  static async updateChart(chart: ChartUpdateSchemaType) {
    const supabase = await createClient();
    const repository = new ChartRepository(supabase);

    const res = await repository.updateChart(chart.id, chart);
    if (res.status === 403) {
      forbidden();
    }
    return res;
  }
}
