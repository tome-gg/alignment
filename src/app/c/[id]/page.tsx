import { loadThreadMessages } from "@/lib/threads";
import { ChatThread } from "./chat-thread";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialMessages = await loadThreadMessages(id);

  return <ChatThread id={id} initialMessages={initialMessages} />;
}
