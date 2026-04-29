"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ChatMessage } from "../types";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CopyIcon, Edit2Icon } from "lucide-react";

export type ActionsProps = ComponentProps<"div">;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn(
        "relative size-9 p-1.5 text-muted-foreground hover:text-foreground",
        className,
      )}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export function PureMessageActions({
  message,
  isLoading,
  setMode,
}: {
  message: ChatMessage;
  isLoading: boolean;
  setMode?: (mode: "view" | "edit") => void;
}) {
  const t = useTranslations("pages.chart.edit.chat.message.actions");
  const { copyToClipboard } = useCopyToClipboard();

  if (isLoading) {
    return null;
  }

  const textFromParts = message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  const handleCopy = async () => {
    if (!textFromParts) {
      toast.error(t("noText"), { position: "top-right" });
      return;
    }

    await copyToClipboard(textFromParts);
    toast.success(t("copied"), { position: "top-right" });
  };

  // User messages get edit (on hover) and copy actions
  if (message.role === "user") {
    return (
      <Actions className="-mr-0.5 justify-end">
        <div className="relative">
          {setMode && (
            <Action
              className="absolute top-0 -left-10 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/message:opacity-100"
              data-testid="message-edit-button"
              onClick={() => setMode("edit")}
              tooltip={t("edit")}
            >
              <Edit2Icon />
            </Action>
          )}
          <Action onClick={handleCopy} tooltip={t("copy")}>
            <CopyIcon />
          </Action>
        </div>
      </Actions>
    );
  }

  return (
    <Actions className="-ml-0.5">
      <Action onClick={handleCopy} tooltip={t("copy")}>
        <CopyIcon />
      </Action>
    </Actions>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) {
      return false;
    }

    return true;
  },
);
