import ChatWindow from "@components/chat";

export default async function ChatApp({
  params: { id },
}: {
  params: { id: string };
}) {
  // const socket = useSocket();
  // const { data: session } = useSession();
  // const user = session?.user;

  return <ChatWindow id={id} />;
}
