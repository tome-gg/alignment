import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { saveThreadMessages } from "@/lib/threads";
import { getChatRatelimit, getClientIp } from "@/lib/ratelimit";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = await getChatRatelimit().limit(ip);
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const { id, messages }: { id: string; messages: UIMessage[] } =
    await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-5",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  result.consumeStream();

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onEnd: ({ messages: finalMessages }) => {
        void saveThreadMessages(id, finalMessages);
      },
    }),
  });
}
