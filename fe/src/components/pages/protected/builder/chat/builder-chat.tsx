"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { SidebarChat } from "@/components/block/chat";
import { useBuilderContext } from "@/components/pages/protected/builder/context";
import type {
  ChartMutationToolName,
  ToolPreviewFormatter,
} from "@/components/block/chat/tools/chart-mutations";
import type { ChartContextPayload } from "@/app/api/chat/schema";
import { merge } from "@/helpers/merge";
import { type Chart } from "@/models/chart";
import { availableCacheDurations } from "@/components/pages/protected/builder/sidebar/cache-accordion-item";

type SidebarChatProps = ComponentProps<typeof SidebarChat>;

type BuilderSidebarChatProps = Pick<
  SidebarChatProps,
  "chartContext" | "onClientToolCall" | "formatToolPreview"
>;

export function BuilderSidebarChat(props: BuilderSidebarChatProps) {
  const ctx = useBuilderContext();
  const tNav = useTranslations("pages.chart.edit.nav");
  const tTool = useTranslations("pages.chart.edit.chat.tool");
  const noneLabel = tTool("noneValue");

  const chartContext = {
    name: ctx.name,
    type: ctx.type,
    theme: ctx.theme,
    axisX: ctx.axisX,
    axisY: ctx.axisY,
    cacheDuration: ctx.cacheDuration,
    limit: ctx.limit,
    sortProperty: ctx.sortProperty,
    sortAscending: ctx.sortAscending,
    databases: ctx.databases.map((db) => ({
      id: db.id,
      name: db.title?.[0]?.plain_text ?? db.id,
      properties: db.properties,
    })),
  } satisfies ChartContextPayload;

  const handleClientToolCall = (
    toolName: ChartMutationToolName,
    input: Record<string, unknown>,
  ): { success: boolean; error?: string } => {
    try {
      switch (toolName) {
        case "setChartName":
          ctx.setName(input.name as string);
          break;
        case "setChartType":
          ctx.setType(input.type as string);
          break;
        case "setChartTheme":
          ctx.setTheme(input.theme as string);
          break;
        case "setAxisX":
          ctx.setAxisX(input.property as string);
          break;
        case "setAxisY":
          ctx.setAxisY(
            input.index as number,
            input.property as string,
            input.aggregation as string | undefined,
            input.conversion as string | undefined,
          );
          break;
        case "addAxisY":
          ctx.addAxisY();
          break;
        case "removeAxisY":
          ctx.removeAxisY(input.index as number);
          break;
        case "setCacheDuration":
          ctx.setCacheDuration(input.duration as number);
          break;
        case "setDataLimit":
          ctx.setLimit(
            input.limit === null ? undefined : (input.limit as number),
          );
          break;
        case "setSortProperty":
          ctx.setSortProperty(input.property as string);
          break;
        case "toggleSortAscending":
          ctx.toggleSortAscending(input.ascending as boolean);
          break;
        case "updateChart":
          ctx._setChart((prev) => {
            const res = merge.withOptions({ mergeArrays: false }, prev, input);
            return res as Chart;
          });
          break;
        case "saveChart":
          ctx.refresh();
          break;
        default:
          return { success: false, error: `Unknown tool: ${toolName}` };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  };

  const resolveProperty = (value: any): string => {
    if (!value || value === "none") return noneLabel;
    return (
      ctx.availableAxisProperties.find((p) => p.value === value)?.name ?? value
    );
  };

  const resolveType = (type: string | undefined | null): string =>
    type ? tNav(`settings.chartType.${type}` as never) : noneLabel;
  const resolveTheme = (theme: string | undefined | null): string =>
    theme ? tNav(`settings.chartTheme.${theme}` as never) : noneLabel;
  const resolveAggregation = (agg: string | undefined | null): string | null =>
    agg && agg !== "none" ? tNav(`axis.aggregation.${agg}` as never) : null;
  const resolveConversion = (conv: string | undefined | null): string | null =>
    conv && conv !== "none" ? tNav(`axis.conversion.${conv}` as never) : null;
  const resolveDirection = (ascending: boolean | undefined): string =>
    ascending ? `↑ ${tTool("sortAscending")}` : `↓ ${tTool("sortDescending")}`;

  const resolveCacheDuration = (
    duration: number | undefined | null,
    withIcon: boolean = true,
  ): React.ReactNode => {
    if (duration == null) return noneLabel;
    const entry = availableCacheDurations.find((d) => d.value === duration);
    if (!withIcon) {
      return entry
        ? "⏱ " + tNav(`cache.durations.${entry.name}`)
        : `${duration}s`;
    }

    return entry ? (
      <>
        {entry.icon}
        {tNav(`cache.durations.${entry.name}`)}
      </>
    ) : (
      `${duration}s`
    );
  };

  const formatAxisYEntry = (
    property: string | undefined,
    aggregation: string | undefined,
    conversion: string | undefined,
  ): string => {
    if (!property) return noneLabel;
    const parts = [resolveProperty(property)];
    const agg = resolveAggregation(aggregation);
    const conv = resolveConversion(conversion);
    if (agg) parts.push(`(${agg})`);
    if (conv) parts.push(`[${conv}]`);
    return parts.join(" ");
  };

  const formatToolPreview: ToolPreviewFormatter = (toolName, input) => {
    switch (toolName) {
      case "setChartName":
        return `${ctx.name ?? noneLabel} → ${input.name as string}`;
      case "setChartType":
        return `${resolveType(ctx.type)} → ${resolveType(input.type as string)}`;
      case "setChartTheme":
        return `${resolveTheme(ctx.theme)} → ${resolveTheme(input.theme as string)}`;
      case "setAxisX":
        return `${resolveProperty(ctx.axisX)} → ${resolveProperty(input.property as string)}`;
      case "setAxisY": {
        const idx = input.index as number;
        const oldEntry = ctx.axisY?.[idx];
        const oldStr = formatAxisYEntry(
          oldEntry?.property,
          oldEntry?.aggregation,
          oldEntry?.conversion,
        );
        const newStr = formatAxisYEntry(
          input.property as string,
          input.aggregation as string | undefined,
          input.conversion as string | undefined,
        );
        return `Y[${idx}]: ${oldStr} → ${newStr}`;
      }
      case "setCacheDuration":
        if (input.icon === false) {
          return `${resolveCacheDuration(ctx.cacheDuration, false)} → ${resolveCacheDuration(input.duration as number, false)}`;
        }

        return (
          <span className="flex gap-2 items-center text-14 font-medium [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {resolveCacheDuration(ctx.cacheDuration)} →
            {resolveCacheDuration(input.duration as number)}
          </span>
        );
      case "setDataLimit":
        return `${ctx.limit ?? noneLabel} → ${input.limit === null ? noneLabel : input.limit}`;
      case "setSortProperty": {
        const oldName = resolveProperty(ctx.sortProperty);
        const newProp = input.property as string;
        const newName =
          newProp === "none" ? noneLabel : resolveProperty(newProp);
        return `${oldName} → ${newName}`;
      }
      case "toggleSortAscending":
        return `${resolveDirection(ctx.sortAscending)} → ${resolveDirection(input.ascending as boolean)}`;
      case "addAxisY":
        return tTool("labels.addAxisY");
      case "removeAxisY":
        return tTool("labels.removeAxisY");
      case "updateChart":
        let changes = input as Chart;
        return `${changes.name ? formatToolPreview("setChartName", input) : ""}
${changes.type ? formatToolPreview("setChartType", input) : ""}
${changes.config?.customization?.theme ? formatToolPreview("setChartTheme", { theme: changes.config.customization.theme }) : ""}
${changes.config?.axis?.x ? formatToolPreview("setAxisX", { property: changes.config.axis.x.property }) : ""}
${changes.config?.axis?.y ? changes.config.axis.y.map((y, idx) => formatToolPreview("setAxisY", { index: idx, ...y })) : ""}
${changes.config?.cache?.duration ? formatToolPreview("setCacheDuration", { duration: changes.config.cache.duration, icon: false }) : ""}
${changes.config?.limit !== undefined ? formatToolPreview("setDataLimit", { limit: changes.config.limit ?? "" }) : ""}
${changes.config?.sort ? formatToolPreview("setSortProperty", { property: changes.config.sort.property }) : ""}
${changes.config?.sort ? formatToolPreview("toggleSortAscending", { ascending: changes.config.sort.ascending }) : ""}`;
      case "saveChart":
        return `${ctx.name ?? noneLabel}
${ctx.type ? resolveType(ctx.type) : ""}
${ctx.theme ? resolveTheme(ctx.theme) : ""}
${ctx.axisX ? resolveProperty(ctx.axisX) : ""}
${ctx.axisY ? ctx.axisY.map((y, idx) => `Y[${idx}]: ${formatAxisYEntry(y.property, y.aggregation, y.conversion)}`).join(", ") : ""}
${ctx.cacheDuration ? resolveCacheDuration(ctx.cacheDuration, false) : ""}
${ctx.limit ? resolveProperty(ctx.limit) : ""}
${ctx.sortProperty ? `${resolveProperty(ctx.sortProperty)} ${resolveDirection(ctx.sortAscending)}` : ""}`;
      default:
        return null;
    }
  };

  return (
    <SidebarChat
      autoResume={false}
      id={"chat-page"}
      initialMessages={[]}
      isReadonly={false}
      chartContext={chartContext}
      onClientToolCall={handleClientToolCall}
      formatToolPreview={formatToolPreview}
    />
  );
}
