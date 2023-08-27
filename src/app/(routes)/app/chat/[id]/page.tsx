import ChatWindow from "@components/chat";

export default async function ChatApp({
  params: { id },
}: {
  params: { id: string };
}) {
  return <ChatWindow id={id} />;
}
