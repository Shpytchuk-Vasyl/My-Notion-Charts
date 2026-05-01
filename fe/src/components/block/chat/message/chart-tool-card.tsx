"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ToolUIPart } from "ai";
import {
  Tool,
  ToolApprovalActions,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "./tool";
import type {
  ChartMutationToolName,
  ToolPreviewFormatter,
} from "@/components/block/chat/tools/chart-mutations";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/components/block/chat/types";

type Props = {
  toolName: ChartMutationToolName;
  toolCallId: string;
  input: Record<string, unknown>;
  state: ToolUIPart["state"];
  output?: unknown;
  onClientToolCall?: (
    toolName: ChartMutationToolName,
    input: Record<string, unknown>,
  ) => { success: boolean; error?: string } | unknown;
  addToolOutput?: UseChatHelpers<ChatMessage>["addToolOutput"];
  formatToolPreview?: ToolPreviewFormatter;
};

export function ChartToolCard({
  toolName,
  toolCallId,
  input,
  state,
  onClientToolCall,
  addToolOutput,
  formatToolPreview,
}: Props) {
  const t = useTranslations("pages.chart.edit.chat.tool");

  const label = t(`labels.${toolName}`);
  const isPending = state === "input-available" || state === "input-streaming";
  const isDone = state === "output-available";
  const isDenied = state === "output-error";

  const previewText =
    state === "input-streaming" || !formatToolPreview
      ? null
      : formatToolPreview?.(toolName, input);

  const handleApprove = async () => {
    if (!addToolOutput) return;
    const result = onClientToolCall?.(toolName, input) as
      | { success: boolean; error?: string }
      | undefined;
    if (result?.success === false) {
      await addToolOutput({
        state: "output-error",
        tool: toolName,
        toolCallId,
        errorText: result.error ?? t("error"),
      });
    } else {
      // @ts-expect-error tools have no outputSchema so SDK types output as undefined
      await addToolOutput({ tool: toolName, toolCallId, output: undefined });
    }
  };

  const handleDeny = async () => {
    await addToolOutput?.({
      state: "output-error",
      tool: toolName,
      toolCallId,
      errorText: t("denied"),
    });
  };

  return (
    <Tool>
      <ToolHeader title={label} type={`tool-${toolName}`} state={state} />
      <ToolContent>
        <ToolInput input={input} preview={previewText} />
        {isDone && <ToolOutput output={t("applied")} />}
        {isDenied && <ToolOutput errorText={t("denied")} />}
        {isPending && (
          <ToolApprovalActions
            approveLabel={t("approve")}
            denyLabel={t("deny")}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        )}
      </ToolContent>
    </Tool>
  );
}
