"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceRepository } from "@/models/workspace";
import { config, z } from "zod";
import {
  ChartRepository,
  type ChartType,
  type ChartConfig,
  DEFAULT_CHART_CONFIG_CACHE_DURATION,
  DEFAULT_CHART_CONFIG_THEME,
  DEFAULT_CHART_CONFIG_LIMIT,
  type Chart,
} from "@/models/chart";
import { UserService } from "@/services/user";
import { WorkspaceService } from "@/services/workspace";
import { NotionService } from "@/services/notion";

export async function deleteWorkspace(workspaceId: string) {
  const supabase = await createClient();

  const repository = new WorkspaceRepository(supabase);

  const { error } = await repository.deleteWorkspace(workspaceId);

  if (error) {
    return { success: false, msg: error.message };
  }
  return { success: true, msg: "" };
}

export async function setWorkspaceAsCurrent(workspaceId: string) {
  const { user, supabase } = await UserService.getCurrentUser();

  const repository = new WorkspaceRepository(supabase);

  await repository.setSelectedWorkspace(user.id, workspaceId);

  const locale = await getLocale();

  redirect({
    locale,
    href: {
      pathname: routing.pathnames["/dashboard"],
    },
  });
}

export async function createChart(_: any, formData: FormData) {
  const t = await getTranslations("validation");
  const chartCreateSchema = z.object({
    chartName: z
      .string(t("chartName.required"))
      .min(2, t("chartName.min"))
      .max(50, t("chartName.max")),
    databases: z
      .array(z.uuid(), t("databases.required"))
      .min(1, t("databases.min")),
    workspaceId: z.uuid(t("workspaceId.required")),
    chartType: z.enum(
      [
        "bar",
        "line",
        "pie",
        "scatter",
        "radar",
        "area",
        "radial",
      ] as ChartType[],
      t("chartType.invalid"),
    ),
  });

  const values = {
    chartName: formData.get("chartName"),
    databases: formData.getAll("database"),
    workspaceId: formData.get("workspaceId"),
    chartType: formData.get("chartType"),
  };

  const result = chartCreateSchema.safeParse(values);
  if (!result.success) {
    return {
      success: false,
      msg: z.treeifyError(result.error).errors.join(", "),
    };
  }

  const supabase = await createClient();
  const repository = new ChartRepository(supabase);

  const { error, data } = await repository.createChart({
    name: result.data.chartName,
    workspace_id: result.data.workspaceId,
    databases: result.data.databases,
    type: result.data.chartType,
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
      joins: Array.from({ length: result.data.databases.length - 1 }, () => ({
        from: "",
        to: "",
      })),
      filters: {},
      limit: DEFAULT_CHART_CONFIG_LIMIT,
      sort: undefined,
      cache: {
        duration: DEFAULT_CHART_CONFIG_CACHE_DURATION,
      },
      customization: {
        theme: DEFAULT_CHART_CONFIG_THEME,
      },
    } as ChartConfig,
  });

  if (error) {
    return { success: false, msg: error.message };
  }

  const locale = await getLocale();

  redirect({
    locale,
    href: {
      params: { id: data.id },
      pathname: routing.pathnames["/chart/[id]/edit"],
    },
  });
  return { success: true, msg: "" };
}

export async function deleteChart(chartId: string) {
  const supabase = await createClient();
  const repository = new ChartRepository(supabase);

  const { error } = await repository.deleteChart(chartId);

  if (error) {
    return { success: false, msg: error.message };
  }

  const locale = await getLocale();

  redirect({
    locale,
    href: {
      pathname: routing.pathnames["/dashboard"],
    },
  });
  return { success: true, msg: "" };
}

export async function updateChart(newChart: Chart) {
  const t = await getTranslations("validation");

  const chartConfigSchema = z.object({
    axis: z.object({
      x: z.object({
        property: z.string().optional(),
        groupBy: z.string().optional(),
      }),
      y: z.array(
        z.object({
          property: z.string().optional(),
          aggregation: z
            .enum(["count", "sum", "average", "min", "max"])
            .optional(),
        }),
      ),
    }),
    joins: z.array(
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      }),
    ),
    filters: z.any().optional(),
    sort: z
      .object({
        property: z.string().optional(),
        ascending: z.boolean().optional(),
      })
      .optional(),
    limit: z.number().min(1).optional(),
    cache: z.object({
      duration: z.number().min(0),
    }),
    customization: z.object({
      theme: z.string(),
    }),
  });

  const chartSchema = z.object({
    id: z.uuid(),
    databases: z
      .array(z.uuid(), t("databases.required"))
      .min(1, t("databases.min")),
    name: z
      .string(t("chartName.required"))
      .min(2, t("chartName.min"))
      .max(50, t("chartName.max")),
    type: z.enum(
      [
        "bar",
        "line",
        "pie",
        "scatter",
        "radar",
        "area",
        "radial",
      ] as ChartType[],
      t("chartType.invalid"),
    ),
    config: chartConfigSchema,
  });

  const result = chartSchema.safeParse(newChart);
  if (!result.success) {
    return {
      success: false,
      msg: z.treeifyError(result.error).errors.join(", "),
    };
  }

  const supabase = await createClient();
  const repository = new ChartRepository(supabase);

  const { error } = await repository.updateChart(result.data.id, {
    name: result.data.name,
    config: result.data.config as any,
    type: result.data.type,
    databases: result.data.databases,
  });

  if (error) {
    return { success: false, msg: error.message };
  }

  return { success: true, msg: "" };
}

export async function getDatabeses() {
  const workspace = await WorkspaceService.getCurrentWorkspace();

  if (!workspace) {
    return { databases: [], id: "" };
  }

  const databases = await new NotionService(
    workspace.access_token,
  ).getDatabases();
  console.log(databases);

  return { databases, id: workspace.id };
}
