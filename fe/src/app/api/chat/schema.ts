import { z } from "zod";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  text: z.string().min(1).max(2000),
});

const filePartSchema = z.object({
  type: z.enum(["file"]),
  mediaType: z.string(),
  name: z.string().min(1).max(100),
  url: z.url(),
});

const partSchema = z.union([textPartSchema, filePartSchema]);

const userMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user"]),
  parts: z.array(partSchema),
});

const toolApprovalMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.record(z.string(), z.unknown())),
});

const axisYItemSchema = z.object({
  property: z.string(),
  aggregation: z.string().optional(),
  conversion: z.string().optional(),
});

const databaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  properties: z.record(z.string(), z.unknown()),
});

export const chartContextSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  theme: z.string().optional(),
  axisX: z.string().optional(),
  axisY: z.array(axisYItemSchema).optional(),
  cacheDuration: z.number().optional(),
  limit: z.number().optional(),
  sortProperty: z.string().optional(),
  sortAscending: z.boolean().optional(),
  databases: z.array(databaseSchema).optional(),
});

export const postRequestBodySchema = z.object({
  id: z.string(),
  message: userMessageSchema.optional(),
  messages: z.array(toolApprovalMessageSchema).optional(),
  selectedChatModel: z.string(),
  chartContext: chartContextSchema.optional(),
});

export type ChartContextPayload = z.infer<typeof chartContextSchema>;
export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
