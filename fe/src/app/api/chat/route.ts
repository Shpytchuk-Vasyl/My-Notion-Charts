import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";

import {
  type PostRequestBody,
  postRequestBodySchema,
  type ChartContextPayload,
} from "./schema";
import { ChatbotError } from "@/components/block/chat/errors";
import { createClient } from "@/lib/supabase/server";
import {
  allowedModelIds,
  chatModels,
  DEFAULT_CHAT_MODEL,
} from "@/components/block/chat/tools/models";
import { getLanguageModel } from "@/components/block/chat/tools/providers";
import { chartMutationTools } from "@/components/block/chat/tools/chart-mutations";
// import { after } from "next/server";
// import { createResumableStreamContext } from "resumable-stream";
import { convertToUIMessages } from "@/components/block/chat/utils";

export const maxDuration = 60;

const BASE_SYSTEM_PROMPT = `You are an AI assistant embedded in a Notion chart builder. Help users create and configure data visualizations from their Notion databases.
The application supports:
- Chart types: bar, line, pie, scatter, radar, area, radial
- X-axis: any Notion database property
- Y-axis: numeric properties with aggregations (none, count, sum, average, min, max) and conversions (none, percentage, number)
- Sorting: by any property, ascending or descending
- Data limit: max number of rows to display
- Cache duration: 0 (no cache), 600 (10 min), 3600 (1 h), 21600 (6 h), 43200 (12 h), 86400 (1 day)
- Visual themes: green, blue, neutral, orange, red, rose, violet, yellow
- Multi-database joins: relate two databases by a shared property
When calling tools, use the exact "value" strings listed in the available databases section for axis and sort properties. Be concise and specific.`;

function buildSystemPrompt(chartContext?: ChartContextPayload): string {
  if (!chartContext) return BASE_SYSTEM_PROMPT;

  const contextLines = [
    `--- Current chart state ---`,
    `Name: ${chartContext.name ?? "—"}`,
    `Type: ${chartContext.type ?? "—"}`,
    `Theme: ${chartContext.theme ?? "—"}`,
    `X-axis property: ${chartContext.axisX ?? "not set"}`,
    `Y-axes: ${
      chartContext.axisY?.length
        ? chartContext.axisY
            .map(
              (y, i) =>
                `[${i}] property=${y.property}, aggregation=${y.aggregation ?? "none"}, conversion=${y.conversion ?? "none"}`,
            )
            .join("; ")
        : "none"
    }`,
    `Cache duration: ${chartContext.cacheDuration ?? 0}s`,
    `Data limit: ${chartContext.limit ?? "none"}`,
    `Sort: ${chartContext.sortProperty ? `${chartContext.sortProperty} (${chartContext.sortAscending ? "asc" : "desc"})` : "none"}`,
    `--- End of chart state ---`,
    chartContext.databases?.length
      ? `Available Notion databases in json format: ${JSON.stringify(chartContext.databases)}`
      : "",
    `You have tools to modify this chart directly. After changes, call saveChart to persist and refresh the preview.`,
  ].join("\n");

  return BASE_SYSTEM_PROMPT + contextLines;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  try {
    const { messages, selectedChatModel, chartContext } = requestBody;

    const client = await createClient();
    const { data: session } = await client.auth.getUser();

    if (!session?.user) {
      return new ChatbotError("unauthorized:chat").toResponse();
    }

    if (messages?.length && messages.length > 10) {
      return new ChatbotError("rate_limit:chat").toResponse();
    }

    const chatModel = allowedModelIds.has(selectedChatModel)
      ? selectedChatModel
      : DEFAULT_CHAT_MODEL;

    let uiMessages = convertToUIMessages(messages as any[]);

    const modelConfig = chatModels.find((m) => m.id === chatModel);
    const isReasoningModel = modelConfig?.provider === "reasoning";

    const modelMessages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      originalMessages: uiMessages,
      execute: async ({ writer: dataStream }) => {
        const result = streamText({
          model: getLanguageModel(chatModel),
          system: buildSystemPrompt(chartContext),
          messages: modelMessages,
          stopWhen: stepCountIs(5),
          tools:
            !isReasoningModel && chartContext ? chartMutationTools : undefined,
        });

        dataStream.merge(
          result.toUIMessageStream({ sendReasoning: isReasoningModel }),
        );
      },
      onFinish: async ({ messages: finishedMessages }) => {
        console.log("Chat stream finished. Final messages:", finishedMessages);
      },
      onError: (error) => {
        console.error("Error in chat stream execution:", error);
        if (
          error instanceof Error &&
          error.message?.includes(
            "AI Gateway requires a valid credit card on file to service requests",
          )
        ) {
          return "AI Gateway requires a valid credit card on file to service requests. Please visit https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card to add a card and unlock your free credits.";
        }
        return "Oops, an error occurred!";
      },
    });

    return createUIMessageStreamResponse({
      stream,
      async consumeSseStream({ stream: sseStream }) {
        if (!process.env.REDIS_URL) {
          return;
        }
        // try {
        //   const streamContext = getStreamContext();
        //   if (streamContext) {
        //     await streamContext.createNewResumableStream(
        //       session?.user.id,
        //       () => sseStream
        //     );
        //   }
        // } catch (_) {
        //   /* non-critical */
        // }
      },
    });
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatbotError) {
      return error.toResponse();
    }

    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests",
      )
    ) {
      return new ChatbotError("bad_request:activate_gateway").toResponse();
    }

    console.error("Unhandled error in chat API:", error, { vercelId });
    return new ChatbotError("offline:chat").toResponse();
  }
}
