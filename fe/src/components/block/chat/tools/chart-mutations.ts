import { tool } from "ai";
import { z } from "zod";
import {
  CHART_TYPES,
  CHART_AGGREGATIONS,
  CHART_CONVERSIONS,
  type Chart,
} from "@/models/chart";
import { chartThemeNames } from "@/components/block/chart/themes";
import { AssertDeepPartial, type DeepPartial } from "@/helpers/types";

// Client-side tools — no `execute`. The browser handles these via BuilderContext.

export const setChartName = tool({
  description: "Rename the chart.",
  inputSchema: z.object({
    name: z.string().min(2).max(50).describe("New chart name"),
  }),
});

export const setChartType = tool({
  description: "Change the chart type.",
  inputSchema: z.object({
    type: z.enum(CHART_TYPES).describe("Chart type"),
  }),
});

export const setChartTheme = tool({
  description: "Change the visual colour theme of the chart.",
  inputSchema: z.object({
    theme: z.enum(chartThemeNames).describe("Theme name"),
  }),
});

export const setAxisX = tool({
  description:
    "Set the X-axis property. Use the property value from availableProperties (format: dbId::propId).",
  inputSchema: z.object({
    property: z.string().describe("Property value in format dbId::propId"),
  }),
});

export const setAxisY = tool({
  description: "Set or update a Y-axis entry by index.",
  inputSchema: z.object({
    index: z.number().int().min(0).describe("Y-axis index (0-based)"),
    property: z.string().describe("Property value in format dbId::propId"),
    aggregation: z.enum(CHART_AGGREGATIONS).optional(),
    conversion: z.enum(CHART_CONVERSIONS).optional(),
  }),
});

export const addAxisY = tool({
  description: "Add a new empty Y-axis entry.",
  inputSchema: z.object({}),
});

export const removeAxisY = tool({
  description: "Remove a Y-axis entry by index.",
  inputSchema: z.object({
    index: z.number().int().min(0),
  }),
});

export const setCacheDuration = tool({
  description:
    "Set cache duration in seconds. Allowed values: 0 (no cache), 600 (10 min), 3600 (1 h), 21600 (6 h), 43200 (12 h), 86400 (1 day).",
  inputSchema: z.object({
    duration: z.number().int().min(0),
  }),
});

export const setDataLimit = tool({
  description:
    "Set the maximum number of data rows displayed. Pass null to remove the limit.",
  inputSchema: z.object({
    limit: z.number().int().min(1).nullable(),
  }),
});

export const setSortProperty = tool({
  description: 'Set the sort property. Pass "none" to remove sorting.',
  inputSchema: z.object({
    property: z.string().describe('Property value (dbId::propId) or "none"'),
  }),
});

export const toggleSortAscending = tool({
  description: "Set sort direction.",
  inputSchema: z.object({
    ascending: z.boolean(),
  }),
});

const updateChartInputSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  type: z.enum(CHART_TYPES).optional(),
  config: z
    .object({
      customization: z
        .object({
          theme: z.enum(chartThemeNames),
        })
        .optional(),
      axis: z
        .object({
          x: z
            .object({
              property: z.string(),
              groupBy: z.string().optional(),
            })
            .optional(),
          y: z
            .array(
              z.object({
                property: z.string(),
                aggregation: z.enum(CHART_AGGREGATIONS).optional(),
                conversion: z.enum(CHART_CONVERSIONS).optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      sort: z
        .object({
          property: z.string(),
          ascending: z.boolean(),
        })
        .nullable()
        .optional(),
      limit: z.number().int().min(1).nullable().optional(),
      cache: z
        .object({
          duration: z.number().int().min(0),
        })
        .optional(),
    })
    .optional(),
});

// Compile-time guard: the inferred input type of updateChart must be a valid (deep) partial of Chart.
// If Chart's shape changes or the schema drifts, this fails to compile — fix one or the other.
type _UpdateChartMatchesChart = AssertDeepPartial<
  z.infer<typeof updateChartInputSchema>,
  Chart
>;
const _assertUpdateChartMatchesChart: _UpdateChartMatchesChart =
  true as _UpdateChartMatchesChart;

export const updateChart = tool({
  description: `Atomically apply multiple chart changes in a single call. Prefer this over chaining individual setters when the user requests two or more changes at once (e.g. "make a pie chart of revenue by status with a blue theme").

  The input mirrors the Chart shape — only include the fields you want to change, the rest omit. Arrays (like config.axis.y) are REPLACED wholesale.

  Schema:
- name: chart title (top level)
- type: chart type (top level): bar | line | pie | scatter | radar | area | radial
- config.customization.theme: visual theme name
- config.axis.x: { property: "dbId::propId" }
- config.axis.y: array of { property: "dbId::propId", aggregation?, conversion? } — replaces all Y-axes
- config.sort: { property: "dbId::propId", ascending } or undefined to clear
- config.limit: 1000 to remove the limit
- config.cache.duration: cache TTL in seconds (0, 600, 3600, 21600, 43200, 86400)

Use the exact "dbId::propId" values from the available databases section. After calling updateChart, call saveChart to persist and refresh the preview.`,
  inputSchema: updateChartInputSchema,
});

export const saveChart = tool({
  description:
    "Persist all pending chart changes and refresh the preview. Call this after making configuration changes.",
  inputSchema: z.object({}),
});

export const CHART_MUTATION_TOOL_NAMES = [
  "setChartName",
  "setChartType",
  "setChartTheme",
  "setAxisX",
  "setAxisY",
  "addAxisY",
  "removeAxisY",
  "setCacheDuration",
  "setDataLimit",
  "setSortProperty",
  "toggleSortAscending",
  "updateChart",
  "saveChart",
] as const;

export type ChartMutationToolName = (typeof CHART_MUTATION_TOOL_NAMES)[number];

export type ToolPreviewFormatter = (
  toolName: ChartMutationToolName,
  input: Record<string, unknown>,
) => any;

export const chartMutationTools = {
  setChartName,
  setChartType,
  setChartTheme,
  setAxisX,
  setAxisY,
  addAxisY,
  removeAxisY,
  setCacheDuration,
  setDataLimit,
  setSortProperty,
  toggleSortAscending,
  updateChart,
  saveChart,
};
