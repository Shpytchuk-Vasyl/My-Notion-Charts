"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import equal from "fast-deep-equal";
import { ArrowUpIcon, PaperclipIcon, SquareIcon } from "lucide-react";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ModelSelectorCompact } from "./model-selector";
import type { Attachment, ChatMessage } from "../types";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./prompt-input";
import { PreviewAttachment } from "../message/preview-attachment";
import { SuggestedActions } from "./suggested-actions";
import { createClient } from "@/lib/supabase/client";

type MultimodalInputProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: () => void;
  attachments: Attachment[];
  setAttachments: Dispatch<SetStateAction<Attachment[]>>;
  messages: UIMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedModelId: string;
  onModelChange?: (modelId: string) => void;
};

function PureMultimodalInput({
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  sendMessage,
  selectedModelId,
  onModelChange,
}: MultimodalInputProps) {
  const t = useTranslations("pages.chart.edit.chat.input");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || "";
      setInput(finalValue);
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);

  const submitForm = () => {
    sendMessage({
      role: "user",
      parts: [
        ...attachments.map((attachment) => ({
          type: "file" as const,
          url: attachment.url,
          name: attachment.name,
          mediaType: attachment.contentType,
        })),
        {
          type: "text",
          text: input,
        },
      ],
    });

    setAttachments([]);
    setInput("");
  };

  const uploadFile = async (file: File) => {
    try {
      const hash = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const hashBuffer = crypto.subtle.digest("SHA-256", arrayBuffer);
          hashBuffer
            .then((buffer) => {
              const hashArray = Array.from(new Uint8Array(buffer));
              const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
              resolve(hashHex);
            })
            .catch((error) => reject(error));
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
      const supabase = await createClient();

      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(hash, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError && !uploadError.message.includes("exist")) {
        throw new Error("File upload failed");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-attachments").getPublicUrl(hash);

      return {
        url: publicUrl,
        name: file.name,
        contentType: file.type,
      };
    } catch (_error) {
      toast.error(t("uploadError", { name: file.name }), {
        position: "top-right",
      });
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    setUploadQueue(files.map((file) => file.name));

    try {
      const uploadPromises = files.map((file) => uploadFile(file));
      const uploadedAttachments = await Promise.all(uploadPromises);
      const successfullyUploadedAttachments = uploadedAttachments.filter(
        (attachment) => attachment !== undefined,
      );

      setAttachments((currentAttachments) => [
        ...currentAttachments,
        ...successfullyUploadedAttachments,
      ]);
    } catch (error) {
      console.error("Error uploading files!", error);
    } finally {
      setUploadQueue([]);
    }
  };

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }

    const imageItems = Array.from(items).filter((item) =>
      item.type.startsWith("image/"),
    );

    if (imageItems.length === 0) {
      return;
    }

    // Prevent default paste behavior for images
    event.preventDefault();

    setUploadQueue((prev) => [...prev, "Pasted image"]);

    try {
      const uploadPromises = imageItems
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)
        .map((file) => uploadFile(file));

      const uploadedAttachments = await Promise.all(uploadPromises);
      const successfullyUploadedAttachments = uploadedAttachments.filter(
        (attachment) =>
          attachment !== undefined &&
          attachment.url !== undefined &&
          attachment.contentType !== undefined,
      );

      setAttachments((curr) => [
        ...curr,
        ...(successfullyUploadedAttachments as Attachment[]),
      ]);
    } catch (error) {
      console.error("Error uploading pasted images:", error);
      toast.error(t("pasteError"), {
        position: "top-right",
      });
    } finally {
      setUploadQueue([]);
    }
  };

  // Add paste event listener to textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.addEventListener("paste", handlePaste);
    return () => textarea.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <>
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions sendMessage={sendMessage} />
        )}

      <input
        className="pointer-events-none fixed -top-4 -left-4 size-0.5 opacity-0"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        tabIndex={-1}
        type="file"
      />

      <PromptInput
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim() && attachments.length === 0) {
            return;
          }
          if (status !== "ready") {
            toast.error(t("waitForModel"), {
              position: "top-right",
            });
          } else {
            submitForm();
          }
        }}
      >
        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div className="flex gap-2 overflow-x-auto">
            {attachments.map((attachment) => (
              <PreviewAttachment
                attachment={attachment}
                key={attachment.url}
                onRemove={() => {
                  setAttachments((currentAttachments) =>
                    currentAttachments.filter((a) => a.url !== attachment.url),
                  );
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
            ))}

            {uploadQueue.map((filename) => (
              <PreviewAttachment
                attachment={{
                  url: "",
                  name: filename,
                  contentType: "",
                }}
                isUploading={true}
                key={filename}
              />
            ))}
          </div>
        )}

        <PromptInputTextarea
          onChange={handleInput}
          placeholder={t("placeholder")}
          ref={textareaRef}
          value={input}
        />

        <PromptInputToolbar>
          {/* Attachments */}
          <PromptInputButton
            size={"icon"}
            disabled={
              status !== "ready" ||
              selectedModelId.includes("reasoning") ||
              selectedModelId.includes("think")
            }
            onClick={(event) => {
              event.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            <PaperclipIcon />
          </PromptInputButton>

          {/* Model Selector */}
          <ModelSelectorCompact
            onModelChange={onModelChange}
            selectedModelId={selectedModelId}
          />

          {/* Submit Button */}
          {status === "submitted" ? (
            <PromptInputButton
              onClick={(event) => {
                event.preventDefault();
                stop();
                setMessages((messages) => messages);
              }}
              className="ml-auto"
              size="icon"
            >
              <SquareIcon />
            </PromptInputButton>
          ) : (
            <PromptInputSubmit
              disabled={!input.trim() || uploadQueue.length > 0}
              status={status}
              className="ml-auto"
            >
              <ArrowUpIcon />
            </PromptInputSubmit>
          )}
        </PromptInputToolbar>
      </PromptInput>
    </>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) {
      return false;
    }
    if (prevProps.status !== nextProps.status) {
      return false;
    }
    if (!equal(prevProps.attachments, nextProps.attachments)) {
      return false;
    }
    if (prevProps.selectedModelId !== nextProps.selectedModelId) {
      return false;
    }

    return true;
  },
);
