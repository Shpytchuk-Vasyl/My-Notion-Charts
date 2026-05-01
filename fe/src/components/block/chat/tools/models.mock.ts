import type { LanguageModel } from "ai";

type MockToolCall = {
  toolName: string;
  input: Record<string, unknown>;
  responseText: string;
};

const mockUsage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 20, text: 20, reasoning: 0 },
};

// tool 1..13 → one entry per ChartMutationToolName
const TOOL_CALLS: MockToolCall[] = [
  {
    toolName: "setChartName",
    input: { name: "Mock Chart" },
    responseText: 'Renamed the chart to "Mock Chart".',
  },
  {
    toolName: "setChartType",
    input: { type: "pie" },
    responseText: "Changed chart type to Pie.",
  },
  {
    toolName: "setChartTheme",
    input: { theme: "blue" },
    responseText: "Applied the blue theme.",
  },
  {
    toolName: "setAxisX",
    input: { property: "2dd3b750-7f2c-814b-a3b2-000b1a28c1b5::title" },
    responseText: "Set X-axis to mock property.",
  },
  {
    toolName: "setAxisY",
    input: {
      index: 0,
      property: "2dd3b750-7f2c-814b-a3b2-000b1a28c1b5::title",
      aggregation: "sum",
    },
    responseText: "Set Y-axis[0] to mock property with sum aggregation.",
  },
  {
    toolName: "addAxisY",
    input: {},
    responseText: "Added a new Y-axis entry.",
  },
  {
    toolName: "removeAxisY",
    input: { index: 0 },
    responseText: "Removed Y-axis entry at index 0.",
  },
  {
    toolName: "setCacheDuration",
    input: { duration: 3600 },
    responseText: "Set cache duration to 1 hour.",
  },
  {
    toolName: "setDataLimit",
    input: { limit: 50 },
    responseText: "Set data limit to 50 rows.",
  },
  {
    toolName: "setSortProperty",
    input: { property: "2dd3b750-7f2c-814b-a3b2-000b1a28c1b5::title" },
    responseText: "Set sort property to mock property.",
  },
  {
    toolName: "toggleSortAscending",
    input: { ascending: false },
    responseText: "Set sort direction to descending.",
  },
  {
    toolName: "updateChart",
    input: {
      name: "Кроки Візуалізація",
      type: "bar",
      config: {
        customization: {
          theme: "green",
        },
        axis: {
          x: {
            property: "2dd3b750-7f2c-814b-a3b2-000b1a28c1b5::%3EasU",
            groupBy: "day",
          },
          y: [
            {
              property: "2dd3b750-7f2c-814b-a3b2-000b1a28c1b5::title",
              aggregation: "none",
              conversion: "none",
            },
          ],
        },
        sort: null,
        limit: 5,
        cache: {
          duration: 3600,
        },
      },
    },
    responseText:
      "Atomic update: renamed to 'Mock Updated Chart', type → Pie, theme → Blue, cache → 1h, limit → 25.",
  },
  {
    toolName: "saveChart",
    input: {},
    responseText: "Chart saved and preview refreshed.",
  },
];

function getMockToolCall(prompt: unknown[]): MockToolCall | null {
  const promptStr = JSON.stringify(prompt[prompt.length - 1]);
  const match = promptStr.match(/tool\s+(\d+)/i);
  if (!match) return null;

  const index = parseInt(match[1], 10) - 1;
  return TOOL_CALLS[index] ?? null;
}

let toolCallCounter = 0;

const createMockModel = (): LanguageModel => {
  return {
    specificationVersion: "v3",
    provider: "mock",
    modelId: "mock-model",
    defaultObjectGenerationMode: "tool",
    supportedUrls: {},

    doGenerate: async ({ prompt }: { prompt: unknown[] }) => {
      const toolCall = getMockToolCall(prompt);

      if (toolCall) {
        const toolCallId = `mock-tc-${++toolCallCounter}`;
        return {
          finishReason: "tool-calls",
          usage: mockUsage,
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: toolCall.toolName,
              input: JSON.stringify(toolCall.input),
            },
            { type: "text", text: toolCall.responseText },
          ],
          warnings: [],
        };
      }

      return {
        finishReason: "stop",
        usage: mockUsage,
        content: [
          {
            type: "text",
            text: `Say "use tool N" (1–${TOOL_CALLS.length}) to trigger a mock tool call.`,
          },
        ],
        warnings: [],
      };
    },

    doStream: ({ prompt }: { prompt: unknown[] }) => {
      const toolCall = getMockToolCall(prompt);
      const text = toolCall
        ? toolCall.responseText
        : `Say "use tool N" (1–${TOOL_CALLS.length}) to trigger a mock tool call.`;
      const words = text.split(" ");

      return {
        stream: new ReadableStream({
          async start(controller) {
            if (toolCall) {
              const toolCallId = `mock-tc-${++toolCallCounter}`;
              controller.enqueue({
                type: "tool-call",
                toolCallId,
                toolName: toolCall.toolName,
                input: JSON.stringify(toolCall.input),
              });
            }

            controller.enqueue({ type: "text-start", id: "t1" });
            for (const word of words) {
              controller.enqueue({
                type: "text-delta",
                id: "t1",
                delta: `${word} `,
              });
              await new Promise((resolve) => {
                setTimeout(resolve, 80);
              });
            }
            controller.enqueue({ type: "text-end", id: "t1" });
            controller.enqueue({
              type: "finish",
              finishReason: toolCall ? "tool-calls" : "stop",
              usage: mockUsage,
            });
            controller.close();
          },
        }),
      };
    },
  } as unknown as LanguageModel;
};

export const chatModel = createMockModel();
