"use server";

import { getLocale } from "next-intl/server";
import { z } from "zod";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { type Chart, ChartRepository } from "@/models/chart";
import { WorkspaceRepository } from "@/models/workspace";
import { UserService } from "@/services/user";
import { ChartService } from "@/services/chart";
import { WorkspaceService } from "@/services/workspace";
import {
  getChartCreateSchema,
  getChartUpdateSchema,
} from "@/zod-schemas/chart";

export async function deleteWorkspace(workspaceId: string) {
  const { error } = await WorkspaceService.deleteWorkspace(workspaceId);

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
  const joins = [];
  for (let i = 0; i < formData.getAll("database").length - 1; i++) {
    joins.push({
      from: formData.get(`joins[${i}][from]`) || "",
      to: formData.get(`joins[${i}][to]`) || "",
    });
  }

  const values = {
    chartName: formData.get("chartName"),
    databases: formData.getAll("database"),
    workspaceId: formData.get("workspaceId"),
    chartType: formData.get("chartType"),
    joins,
    aiConfig: formData.get("aiConfig") === "on",
  };

  const result = (await getChartCreateSchema()).safeParse(values);
  if (!result.success) {
    return {
      success: false,
      msg: z.prettifyError(result.error),
    };
  }

  const { error, data } = await ChartService.createChart(result.data);

  if (error) {
    return { success: false, msg: error.message };
  }

  if (values.aiConfig) {
    // todo
    // await ChartService.updateChart({
    //   id: data.id,
    //   config: await AiService.generateChartConfig(
    //     data
    //   )
    // })
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

  return { success: true, msg: "" };
}

async function revalidateISR(id: string) {
  const revalidatePath = (await import("next/cache")).revalidatePath;

  const openIntervals = [600, 3600, 21600, 43200, 86400];
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/chart/${id}/view/open`);
    for (const interval of openIntervals) {
      revalidatePath(`/${locale}/chart/${id}/view/open/${interval}`);
    }
  }
}

export async function updateChart(newChart: Chart) {
  const result = (await getChartUpdateSchema()).safeParse(newChart);
  if (!result.success) {
    return {
      success: false,
      msg: z.prettifyError(result.error),
    };
  }

  const { error, data } = await ChartService.updateChart(result.data);

  if (error) {
    return { success: false, msg: error.message };
  }

  if (data?.is_public && data?.id) {
    await revalidateISR(data.id);
  }

  return { success: true, msg: "" };
}

export async function updateChartPublicStatus({
  id,
  is_public,
}: {
  id: string;
  is_public: boolean;
}) {
  const { error } = await ChartService.updateChart({
    id,
    is_public,
  } as Chart);

  if (error) {
    return { success: false, msg: error.message };
  }

  await revalidateISR(id);

  return { success: true, msg: "" };
}
