"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceRepository } from "@/models/workspace";
import { z } from "zod";
import { chartIcons } from "@/components/block/chart/icons";
import { ChartRepository } from "@/models/chart";
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
    chartType: z.enum(Object.keys(chartIcons), t("chartType.invalid")),
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
    config: {
      databases: result.data.databases,
    },
    // @ts-expect-error
    type: result.data.chartType,
  });

  if (error) {
    return { success: false, msg: error.message };
  }

  const locale = await getLocale();

  redirect({
    locale,
    href: {
      params: { chartId: data.id },
      pathname: routing.pathnames["/chart/[chartId]/edit"],
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

export async function getDatabeses() {
  const workspace = await WorkspaceService.getCurrentWorkspace();

  if (!workspace) {
    return { databases: [], id: "" };
  }

  const databases = await new NotionService(
    workspace.access_token,
  ).getDatabases();

  return { databases, id: workspace.id };
}
