import type { InferUITool, UIMessage } from "ai";
import type { getWeather } from "./tools/get-weather";

export type DataPart = { type: "append-message"; message: string };

export type MessageMetadata = {
  createdAt: string;
};

type weatherTool = InferUITool<typeof getWeather>;

export type ChatTools = {
  getWeather: weatherTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: any;
  appendMessage: string;
  id: string;
  title: string;
  clear: null;
  finish: null;
  "chat-title": string;
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
