import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "../types";
import { Button } from "@/components/ui/button";

type SuggestedActionsProps = {
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export function SuggestedActions({ sendMessage }: SuggestedActionsProps) {
  const suggestedActions = [
    "Write code to demonstrate Dijkstra's algorithm",
    "Help me write an essay about Silicon Valley",
    "What are the advantages of using Next.js?",
    "What is the weather in San Francisco?",
  ];

  return (
    <ul className="space-y-2">
      {suggestedActions.map((suggestedAction, index) => (
        <Button
          asChild
          key={suggestedAction}
          className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 fill-mode-[both]"
          size="sm"
          variant="outline"
          onClick={() => {
            sendMessage({
              role: "user",
              parts: [{ type: "text", text: suggestedAction }],
            });
          }}
          style={{ animationDelay: `${0.5 + 0.25 * index}s` }}
        >
          <li>{suggestedAction}</li>
        </Button>
      ))}
    </ul>
  );
}
