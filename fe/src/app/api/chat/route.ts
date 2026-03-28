import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";

import { type PostRequestBody, postRequestBodySchema } from "./schema";
import { ChatbotError } from "@/components/block/chat/errors";
import { createClient } from "@/lib/supabase/server";
import {
  allowedModelIds,
  chatModels,
  DEFAULT_CHAT_MODEL,
} from "@/components/block/chat/tools/models";
import { getLanguageModel } from "@/components/block/chat/tools/providers";
import { getWeather } from "@/components/block/chat/tools/get-weather";
// import { after } from "next/server";
// import { createResumableStreamContext } from "resumable-stream";
import { convertToUIMessages } from "@/components/block/chat/utils";

export const maxDuration = 60;

// function getStreamContext() {
//   try {
//     return createResumableStreamContext({ waitUntil: after });
//   } catch (_) {
//     return null;
//   }
// }

// export { getStreamContext };

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  try {
    const { messages, selectedChatModel } = requestBody;

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

    const isToolApprovalFlow = false; // TODO: determine this based on messages or other request data

    let uiMessages = convertToUIMessages(messages as any[]);

    //  if (isToolApprovalFlow && messages) {
    //     const dbMessages = convertToUIMessages(messagesFromDb);
    //     const approvalStates = new Map(
    //       messages.flatMap(
    //         (m) =>
    //           m.parts
    //             ?.filter(
    //               (p: Record<string, unknown>) =>
    //                 p.state === "approval-responded" ||
    //                 p.state === "output-denied"
    //             )
    //             .map((p: Record<string, unknown>) => [
    //               String(p.toolCallId ?? ""),
    //               p,
    //             ]) ?? []
    //       )
    //     );
    //     uiMessages = dbMessages.map((msg) => ({
    //       ...msg,
    //       parts: msg.parts.map((part) => {
    //         if (
    //           "toolCallId" in part &&
    //           approvalStates.has(String(part.toolCallId))
    //         ) {
    //           return { ...part, ...approvalStates.get(String(part.toolCallId)) };
    //         }
    //         return part;
    //       }),
    //     })) as ChatMessage[];
    //   } else {
    //     uiMessages = [
    //       ...convertToUIMessages(messagesFromDb),
    //       message as ChatMessage,
    //     ];
    //   }

    const modelConfig = chatModels.find((m) => m.id === chatModel);
    const isReasoningModel = modelConfig?.provider === "reasoning";
    const supportsTools = false; // TODO: determine this based on the model or other request data

    const modelMessages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      originalMessages: isToolApprovalFlow ? uiMessages : undefined,
      execute: async ({ writer: dataStream }) => {
        const result = streamText({
          model: getLanguageModel(chatModel),
          messages: modelMessages,
          stopWhen: stepCountIs(5),
          experimental_activeTools:
            isReasoningModel && !supportsTools ? [] : ["getWeather"],

          tools: {
            getWeather,
          },
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
