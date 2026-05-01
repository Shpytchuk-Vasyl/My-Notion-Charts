"use client";

import type { DynamicToolUIPart, ToolUIPart } from "ai";
import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { isValidElement } from "react";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    defaultOpen
    className={cn("group not-prose mb-4 w-full rounded-md border", className)}
    {...props}
  />
);

export type ToolPart = ToolUIPart | DynamicToolUIPart;

export type ToolHeaderProps = {
  title?: string;
  className?: string;
} & (
  | { type: ToolUIPart["type"]; state: ToolUIPart["state"]; toolName?: never }
  | {
      type: DynamicToolUIPart["type"];
      state: DynamicToolUIPart["state"];
      toolName: string;
    }
);

const stateKeyMap: Record<ToolPart["state"], string> = {
  "approval-requested": "approvalRequested",
  "approval-responded": "approvalResponded",
  "input-available": "inputAvailable",
  "input-streaming": "inputStreaming",
  "output-available": "outputAvailable",
  "output-denied": "outputDenied",
  "output-error": "outputError",
};

const statusIcons: Record<ToolPart["state"], ReactNode> = {
  "approval-requested": <ClockIcon className="size-4 text-yellow-600" />,
  "approval-responded": <CheckCircleIcon className="size-4 text-blue-600" />,
  "input-available": <ClockIcon className="size-4 animate-pulse" />,
  "input-streaming": <CircleIcon className="size-4" />,
  "output-available": <CheckCircleIcon className="size-4 text-green-600" />,
  "output-denied": <XCircleIcon className="size-4 text-orange-600" />,
  "output-error": <XCircleIcon className="size-4 text-red-600" />,
};

const StatusBadge = ({ state }: { state: ToolPart["state"] }) => {
  const t = useTranslations("pages.chart.edit.chat.tool.status");
  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
      {statusIcons[state]}
      {t(stateKeyMap[state])}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  toolName,
  ...props
}: ToolHeaderProps) => {
  const derivedName =
    type === "dynamic-tool" ? toolName : type.split("-").slice(1).join("-");

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between gap-4 p-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm text-start">
          {title ?? derivedName}
        </span>
        <StatusBadge state={state} />
      </div>
      <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 space-y-4 p-4 text-popover-foreground outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolPart["input"];
  preview?: ReactNode;
};

export const ToolInput = ({
  className,
  input,
  preview,
  ...props
}: ToolInputProps) => {
  const t = useTranslations("pages.chart.edit.chat.tool");
  return (
    <div className={cn("space-y-2 overflow-hidden", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {t("parameters")}
      </h4>
      <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs">
        {preview ?? JSON.stringify(input, null, 2)}
      </pre>
    </div>
  );
};

export type ToolApprovalActionsProps = {
  approveLabel?: string;
  denyLabel?: string;
  onApprove: () => void;
  onDeny: () => void;
  className?: string;
};

export const ToolApprovalActions = ({
  approveLabel,
  denyLabel,
  onApprove,
  onDeny,
  className,
}: ToolApprovalActionsProps) => {
  const t = useTranslations("pages.chart.edit.chat.tool");
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t pt-2",
        className,
      )}
    >
      <Button variant="ghost" size="sm" onClick={onDeny} type="button">
        {denyLabel ?? t("deny")}
      </Button>
      <Button size="sm" onClick={onApprove} type="button">
        {approveLabel ?? t("approve")}
      </Button>
    </div>
  );
};

export type ToolOutputProps = ComponentProps<"div"> & {
  output?: ToolPart["output"];
  errorText?: ToolPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  const t = useTranslations("pages.chart.edit.chat.tool");

  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs">
        {JSON.stringify(output, null, 2)}
      </pre>
    );
  } else if (typeof output === "string") {
    Output = (
      <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs">
        {output}
      </pre>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? t("error") : t("result")}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          errorText && "bg-destructive/10 text-destructive",
        )}
      >
        {errorText && <div className={output ? "" : "p-3"}>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
