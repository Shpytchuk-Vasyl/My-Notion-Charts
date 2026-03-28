"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useState } from "react";
import { useDataStream } from "../data-stream-provider";
import { MessageContent } from "./base";
import { Response } from "./response";
// import {
//   Tool,
//   ToolContent,
//   ToolHeader,
//   ToolInput,
//   ToolOutput,
// } from "./elements/tool";
import { MessageActions } from "./actions";
import { MessageEditor } from "./editor";
import { MessageReasoning } from "./reasoning";
import { PreviewAttachment } from "./preview-attachment";
import { ChatMessage } from "../types";
import { cn } from "@/lib/utils";
import { sanitizeText } from "../utils";
import { ArrowDownIcon, SparklesIcon } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { Greeting } from "../greeting";

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
};

export function Messages({
  addToolApprovalResponse,
  status,
  messages,
  setMessages,
  regenerate,
  isReadonly,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({
    status,
  });

  useDataStream();

  return (
    <div className="relative flex-1">
      <div
        className="absolute inset-0 touch-pan-y overflow-y-auto"
        ref={messagesContainerRef}
      >
        <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
          {messages.length === 0 && <Greeting />}

          {messages.map((message, index) => (
            <PreviewMessage
              addToolApprovalResponse={addToolApprovalResponse}
              isLoading={
                status === "streaming" && messages.length - 1 === index
              }
              isReadonly={isReadonly}
              key={message.id}
              message={message}
              regenerate={regenerate}
              requiresScrollPadding={
                hasSentMessage && index === messages.length - 1
              }
              setMessages={setMessages}
            />
          ))}

          {status === "submitted" &&
            !messages.some((msg) =>
              msg.parts?.some(
                (part) =>
                  "state" in part && part.state === "approval-responded",
              ),
            ) && <ThinkingMessage />}

          <ThinkingMessage />
          <div className="min-w-6 shrink-0" ref={messagesEndRef} />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={`absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background p-2 shadow-lg transition-all hover:bg-muted ${
          isAtBottom
            ? "pointer-events-none scale-0 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}

export const PreviewMessage = ({
  addToolApprovalResponse,
  message,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding: _requiresScrollPadding,
}: {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file",
  );

  useDataStream();

  return (
    <div
      className="group/message fade-in w-full animate-in duration-200"
      data-role={message.role}
    >
      <div
        className={cn("flex w-full items-start gap-2 md:gap-3", {
          "justify-end": message.role === "user" && mode !== "edit",
          "justify-start": message.role === "assistant",
        })}
      >
        {message.role === "assistant" && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <SparklesIcon className="size-4" />
          </div>
        )}

        <div
          className={cn("flex flex-col", {
            "gap-2 md:gap-4": message.parts?.some(
              (p) => p.type === "text" && p.text?.trim(),
            ),
            "w-full":
              (message.role === "assistant" &&
                (message.parts?.some(
                  (p) => p.type === "text" && p.text?.trim(),
                ) ||
                  message.parts?.some((p) => p.type.startsWith("tool-")))) ||
              mode === "edit",
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
              message.role === "user" && mode !== "edit",
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div className="flex flex-row justify-end gap-2">
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  attachment={{
                    name: attachment.filename ?? "file",
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                  key={attachment.url}
                />
              ))}
            </div>
          )}

          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "reasoning") {
              const hasContent = part.text?.trim().length > 0;
              if (hasContent) {
                const isStreaming =
                  "state" in part && part.state === "streaming";
                return (
                  <MessageReasoning
                    isLoading={isLoading || isStreaming}
                    key={key}
                    reasoning={part.text}
                  />
                );
              }
            }

            if (type === "text") {
              if (mode === "view") {
                return (
                  <MessageContent
                    key={key}
                    className={cn({
                      "wrap-break-word w-fit rounded-2xl px-3 py-2 text-right bg-background":
                        message.role === "user",
                      "bg-transparent px-0 py-0 text-left":
                        message.role === "assistant",
                    })}
                  >
                    <Response>{sanitizeText(part.text)}</Response>
                  </MessageContent>
                );
              }

              if (mode === "edit") {
                return (
                  <div
                    className="flex w-full flex-row items-start gap-3"
                    key={key}
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        regenerate={regenerate}
                        setMessages={setMessages}
                        setMode={setMode}
                      />
                    </div>
                  </div>
                );
              }
            }

            // if (type === "tool-getWeather") {
            //   const { toolCallId, state } = part;
            //   const approvalId = (part as { approval?: { id: string } })
            //     .approval?.id;
            //   const isDenied =
            //     state === "output-denied" ||
            //     (state === "approval-responded" &&
            //       (part as { approval?: { approved?: boolean } }).approval
            //         ?.approved === false);
            //   const widthClass = "w-[min(100%,450px)]";

            //   if (state === "output-available") {
            //     return (
            //       <div className={widthClass} key={toolCallId}>
            //         <Weather weatherAtLocation={part.output} />
            //       </div>
            //     );
            //   }

            //   if (isDenied) {
            //     return (
            //       <div className={widthClass} key={toolCallId}>
            //         <Tool className="w-full" defaultOpen={true}>
            //           <ToolHeader
            //             state="output-denied"
            //             type="tool-getWeather"
            //           />
            //           <ToolContent>
            //             <div className="px-4 py-3 text-muted-foreground text-sm">
            //               Weather lookup was denied.
            //             </div>
            //           </ToolContent>
            //         </Tool>
            //       </div>
            //     );
            //   }

            //   if (state === "approval-responded") {
            //     return (
            //       <div className={widthClass} key={toolCallId}>
            //         <Tool className="w-full" defaultOpen={true}>
            //           <ToolHeader state={state} type="tool-getWeather" />
            //           <ToolContent>
            //             <ToolInput input={part.input} />
            //           </ToolContent>
            //         </Tool>
            //       </div>
            //     );
            //   }

            //   return (
            //     <div className={widthClass} key={toolCallId}>
            //       <Tool className="w-full" defaultOpen={true}>
            //         <ToolHeader state={state} type="tool-getWeather" />
            //         <ToolContent>
            //           {(state === "input-available" ||
            //             state === "approval-requested") && (
            //             <ToolInput input={part.input} />
            //           )}
            //           {state === "approval-requested" && approvalId && (
            //             <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
            //               <button
            //                 className="rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
            //                 onClick={() => {
            //                   addToolApprovalResponse({
            //                     id: approvalId,
            //                     approved: false,
            //                     reason: "User denied weather lookup",
            //                   });
            //                 }}
            //                 type="button"
            //               >
            //                 Deny
            //               </button>
            //               <button
            //                 className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
            //                 onClick={() => {
            //                   addToolApprovalResponse({
            //                     id: approvalId,
            //                     approved: true,
            //                   });
            //                 }}
            //                 type="button"
            //               >
            //                 Allow
            //               </button>
            //             </div>
            //           )}
            //         </ToolContent>
            //       </Tool>
            //     </div>
            //   );
            // }

            // if (type === "tool-createDocument") {
            //   const { toolCallId } = part;

            //   if (part.output && "error" in part.output) {
            //     return (
            //       <div
            //         className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
            //         key={toolCallId}
            //       >
            //         Error creating document: {String(part.output.error)}
            //       </div>
            //     );
            //   }

            //   return (
            //     <DocumentPreview
            //       isReadonly={isReadonly}
            //       key={toolCallId}
            //       result={part.output}
            //     />
            //   );
            // }

            // if (type === "tool-updateDocument") {
            //   const { toolCallId } = part;

            //   if (part.output && "error" in part.output) {
            //     return (
            //       <div
            //         className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
            //         key={toolCallId}
            //       >
            //         Error updating document: {String(part.output.error)}
            //       </div>
            //     );
            //   }

            //   return (
            //     <div className="relative" key={toolCallId}>
            //       <DocumentPreview
            //         args={{ ...part.output, isUpdate: true }}
            //         isReadonly={isReadonly}
            //         result={part.output}
            //       />
            //     </div>
            //   );
            // }

            // if (type === "tool-requestSuggestions") {
            //   const { toolCallId, state } = part;

            //   return (
            //     <Tool defaultOpen={true} key={toolCallId}>
            //       <ToolHeader state={state} type="tool-requestSuggestions" />
            //       <ToolContent>
            //         {state === "input-available" && (
            //           <ToolInput input={part.input} />
            //         )}
            //         {state === "output-available" && (
            //           <ToolOutput
            //             errorText={undefined}
            //             output={
            //               "error" in part.output ? (
            //                 <div className="rounded border p-2 text-red-500">
            //                   Error: {String(part.output.error)}
            //                 </div>
            //               ) : (
            //                 <DocumentToolResult
            //                   isReadonly={isReadonly}
            //                   result={part.output}
            //                   type="request-suggestions"
            //                 />
            //               )
            //             }
            //           />
            //         )}
            //       </ToolContent>
            //     </Tool>
            //   );
            // }

            return null;
          })}

          {!isReadonly && (
            <MessageActions
              isLoading={isLoading}
              key={`action-${message.id}`}
              message={message}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const ThinkingMessage = () => {
  return (
    <div
      className="group/message fade-in w-full animate-in duration-300"
      data-role="assistant"
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <SparklesIcon className="animate-pulse size-4" />
        </div>

        <div className="flex text-muted-foreground text-sm">
          <span className="animate-pulse">Thinking</span>

          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>
      </div>
    </div>
  );
};
