import type { UIMessage } from "ai";
import { getRedis } from "./redis";

const THREAD_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function threadKey(threadId: string): string {
  return `thread:${threadId}`;
}

export async function loadThreadMessages(
  threadId: string,
): Promise<UIMessage[]> {
  const stored = await getRedis().get<UIMessage[]>(threadKey(threadId));
  return stored ?? [];
}

export async function saveThreadMessages(
  threadId: string,
  messages: UIMessage[],
): Promise<void> {
  await getRedis().set(threadKey(threadId), messages, {
    ex: THREAD_TTL_SECONDS,
  });
}
