"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDataStream } from "../data-stream-provider";
import { MessageContent } from "./base";
import { Response } from "./response";
import { MessageActions } from "./actions";
import { MessageEditor } from "./editor";
import { MessageReasoning } from "./reasoning";
import { PreviewAttachment } from "./preview-attachment";
import { ChartToolCard } from "./chart-tool-card";
import { ChatMessage, ChatTools } from "../types";
import { cn } from "@/lib/utils";
import { sanitizeText } from "../utils";
import { ArrowDownIcon, SparklesIcon } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { Greeting } from "../greeting";
import {
  CHART_MUTATION_TOOL_NAMES,
  type ChartMutationToolName,
  type ToolPreviewFormatter,
} from "../tools/chart-mutations";
import type { ToolUIPart } from "ai";

const chartToolSet = new Set<string>(CHART_MUTATION_TOOL_NAMES);

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  addToolOutput: UseChatHelpers<ChatMessage>["addToolOutput"];
  onClientToolCall?: (
    toolName: ChartMutationToolName,
    input: Record<string, unknown>,
  ) => unknown;
  formatToolPreview?: ToolPreviewFormatter;
  status: UseChatHelpers<ChatMessage>["status"];
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
};

export function Messages({
  addToolApprovalResponse,
  addToolOutput,
  onClientToolCall,
  formatToolPreview,
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
              addToolOutput={addToolOutput}
              onClientToolCall={onClientToolCall}
              formatToolPreview={formatToolPreview}
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

          <div className="min-w-6 shrink-0" ref={messagesEndRef} />
        </div>
      </div>

      <ScrollToBottomButton
        scrollToBottom={scrollToBottom}
        isAtBottom={isAtBottom}
      />
    </div>
  );
}

function ScrollToBottomButton({
  scrollToBottom,
  isAtBottom,
}: {
  scrollToBottom: (behavior: ScrollBehavior) => void;
  isAtBottom: boolean;
}) {
  const t = useTranslations("pages.chart.edit.chat.message");
  return (
    <button
      aria-label={t("scrollToBottom")}
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
  );
}

export const PreviewMessage = ({
  addToolApprovalResponse,
  addToolOutput,
  onClientToolCall,
  formatToolPreview,
  message,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding: _requiresScrollPadding,
}: {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  addToolOutput: UseChatHelpers<ChatMessage>["addToolOutput"];
  onClientToolCall?: (
    toolName: ChartMutationToolName,
    input: Record<string, unknown>,
  ) => unknown;
  formatToolPreview?: ToolPreviewFormatter;
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
                message.parts?.some(
                  (p) => p.type === "text" && p.text?.trim(),
                )) ||
              mode === "edit",
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
              mode !== "edit",
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

            if (type.startsWith("tool-")) {
              const toolName = type.slice("tool-".length);
              if (chartToolSet.has(toolName)) {
                const p = part as ToolUIPart<ChatTools>;
                return (
                  <ChartToolCard
                    key={p.toolCallId ?? key}
                    toolName={toolName as ChartMutationToolName}
                    toolCallId={p.toolCallId}
                    input={p.input ?? {}}
                    state={p.state}
                    output={p.output}
                    onClientToolCall={onClientToolCall}
                    addToolOutput={addToolOutput}
                    formatToolPreview={formatToolPreview}
                  />
                );
              }
            }

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
  const t = useTranslations("pages.chart.edit.chat.message");
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
          <span className="animate-pulse">{t("thinking")}</span>

          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>
      </div>
    </div>
  );
};
