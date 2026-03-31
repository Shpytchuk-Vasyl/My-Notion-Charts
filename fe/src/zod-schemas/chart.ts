import { type ChartType } from "@/models/chart";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export const getChartCreateSchema = async () => {
  const t = await getTranslations("validation");
  return z.object({
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
    joins: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
      }),
    ),
  });
};

export type ChartCreateSchemaType = z.infer<
  Awaited<ReturnType<typeof getChartCreateSchema>>
>;

export const getChartUpdateSchema = async () => {
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
          conversion: z.enum(["percentage", "number"]).optional(),
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

  return z.object({
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
};

export type ChartUpdateSchemaType = z.infer<
  Awaited<ReturnType<typeof getChartUpdateSchema>>
>;
