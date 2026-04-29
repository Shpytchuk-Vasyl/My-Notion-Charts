"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAutoResume } from "@/components/block/chat/use-auto-resume";
import { ChatbotError } from "./errors";
import type { Attachment, ChatMessage } from "./types";
import { fetchWithErrorHandlers } from "./utils";
import { DataStreamProvider, useDataStream } from "./data-stream-provider";
import { Messages } from "./message";
import { MultimodalInput } from "./input/multimodal-input";
import { toast } from "sonner";
import { useChatSidebar } from "@/pages/protected/builder/chat/context";
import { DEFAULT_CHAT_MODEL } from "./tools/models";

function PureChat({
  id,
  initialMessages,
  initialChatModel = DEFAULT_CHAT_MODEL,
  isReadonly,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel?: string;
  isReadonly: boolean;
  autoResume: boolean;
}) {
  const { setDataStream } = useDataStream();

  const t = useTranslations("pages.chart.edit.chat");
  const [input, setInput] = useState<string>("");
  const [showCreditCardAlert, setShowCreditCardAlert] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(currentModelId);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
    addToolApprovalResponse,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    sendAutomaticallyWhen: ({ messages: currentMessages }) => {
      const lastMessage = currentMessages.at(-1);
      const shouldContinue =
        lastMessage?.parts?.some(
          (part) =>
            "state" in part &&
            part.state === "approval-responded" &&
            "approval" in part &&
            (part.approval as { approved?: boolean })?.approved === true,
        ) ?? false;
      return shouldContinue;
    },
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest(request) {
        const lastMessage = request.messages.at(-1);
        const isToolApprovalContinuation =
          lastMessage?.role !== "user" ||
          request.messages.some((msg) =>
            msg.parts?.some((part) => {
              const state = (part as { state?: string }).state;
              return (
                state === "approval-responded" || state === "output-denied"
              );
            }),
          );

        return {
          body: {
            id: request.id,
            messages: request.messages,
            selectedChatModel: currentModelIdRef.current,
            ...request.body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {
      // mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error.message?.includes("AI Gateway requires a valid credit card")) {
        setShowCreditCardAlert(true);
      } else if (error instanceof ChatbotError) {
        toast.error(error.message, { position: "top-right" });
      } else {
        toast.error(error.message || t("errors.generic"), {
          position: "top-right",
        });
      }
    },
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <>
      <div className="flex h-full min-w-0 touch-pan-y flex-col">
        <Messages
          addToolApprovalResponse={addToolApprovalResponse}
          isReadonly={isReadonly}
          messages={messages}
          regenerate={regenerate}
          setMessages={setMessages}
          status={status}
        />

        <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl border-t-0 px-2 pb-3 md:px-4 md:pb-4 flex-col gap-4">
          {!isReadonly && (
            <MultimodalInput
              attachments={attachments}
              input={input}
              messages={messages}
              onModelChange={setCurrentModelId}
              selectedModelId={currentModelId}
              sendMessage={sendMessage}
              setAttachments={setAttachments}
              setInput={setInput}
              setMessages={setMessages}
              status={status}
              stop={stop}
            />
          )}
        </div>
      </div>

      <AlertDialog
        onOpenChange={setShowCreditCardAlert}
        open={showCreditCardAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("gateway.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {process.env.NODE_ENV === "production"
                ? t("gateway.descriptionProd")
                : t("gateway.descriptionDev")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("gateway.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(
                  "https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card",
                  "_blank",
                );
              }}
            >
              {t("gateway.activate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const Chat = (props: ComponentProps<typeof PureChat>) => {
  return (
    <DataStreamProvider>
      <PureChat {...props} />
    </DataStreamProvider>
  );
};

export const SidebarChat = (props: ComponentProps<typeof PureChat>) => {
  const { open } = useChatSidebar();

  return (
    <DataStreamProvider>{open && <PureChat {...props} />}</DataStreamProvider>
  );
};
