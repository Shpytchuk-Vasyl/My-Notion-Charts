import type { UseChatHelpers } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import type { ChatMessage } from "../types";
import { Button } from "@/components/ui/button";

type SuggestedActionsProps = {
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export function SuggestedActions({ sendMessage }: SuggestedActionsProps) {
  const t = useTranslations("pages.chart.edit.chat");
  const suggestions = t.raw("suggestions") as string[];

  return (
    <ul className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <Button
          asChild
          key={suggestion}
          className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 fill-mode-[both]"
          size="sm"
          variant="outline"
          onClick={() => {
            sendMessage({
              role: "user",
              parts: [{ type: "text", text: suggestion }],
            });
          }}
          style={{ animationDelay: `${0.5 + 0.25 * index}s` }}
        >
          <li>{suggestion}</li>
        </Button>
      ))}
    </ul>
  );
}
