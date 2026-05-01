import type { InferUITool, UIMessage } from "ai";
import type { chartMutationTools } from "./tools/chart-mutations";

export type DataPart = { type: "append-message"; message: string };

export type MessageMetadata = {
  createdAt: string;
};

export type ChatTools = {
  [K in keyof typeof chartMutationTools]: InferUITool<
    (typeof chartMutationTools)[K]
  >;
};

export type CustomUIDataTypes = {
  appendMessage: string;
  id: string;
  title: string;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
