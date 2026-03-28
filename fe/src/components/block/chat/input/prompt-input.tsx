"use client";

import type { ChatStatus } from "ai";
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from "lucide-react";
import type {
  ComponentProps,
  HTMLAttributes,
  KeyboardEventHandler,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type PromptInputProps = HTMLAttributes<HTMLFormElement>;

export const PromptInput = ({ ...props }: PromptInputProps) => (
  <form
    className="rounded-xl border border-input bg-background p-3 shadow-xs transition-[color,box-shadow] duration-200 hover:border-ring w-full overflow-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]"
    {...props}
  />
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = ({
  onChange,
  placeholder = "What would you like to know?",
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.shiftKey) {
        return;
      }

      e.preventDefault();

      const form = e.currentTarget.form;
      const submitButton = form?.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement | null;
      if (submitButton?.disabled) {
        return;
      }

      form?.requestSubmit();
    }
  };

  return (
    <Textarea
      className="resize-none border-0! border-none! p-3 text-base outline-none! shadow-none! ring-0! ring-offset-0! bg-transparent dark:bg-transparent field-sizing-content max-h-[6lh]"
      name="message"
      onChange={(e) => {
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputToolbar = ({ ...props }: PromptInputToolbarProps) => (
  <div className="flex items-center w-full gap-1" {...props} />
);

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
  variant = "ghost",
  ...props
}: PromptInputButtonProps) => {
  return <Button type="button" variant={variant} {...props} />;
};

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};

export const PromptInputSubmit = ({
  variant = "default",
  size = "icon",
  status,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <SendIcon />;

  if (status === "submitted") {
    Icon = <Loader2Icon className="animate-spin" />;
  } else if (status === "streaming") {
    Icon = <SquareIcon />;
  } else if (status === "error") {
    Icon = <XIcon />;
  }

  return (
    <Button size={size} type="submit" variant={variant} {...props}>
      {children ?? Icon}
    </Button>
  );
};
