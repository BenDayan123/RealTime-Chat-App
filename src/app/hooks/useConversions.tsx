import { useChannel, useEvent } from "@harelpls/use-pusher";
import { IConversion } from "@interfaces/conversion";
import { IMessage } from "@interfaces/message";
import { Events } from "@lib/events";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

async function fetchConversions(id: string) {
  const res = await axios.get<string[]>(`/api/user/${id}/conversions`);
  return res.data;
}
async function fetchConversion(user: string, chat: string) {
  const res = await axios.get<IConversion>(
    `/api/user/${user}/conversions/${chat}`
  );
  return res.data;
}

export function useConversion(id: string) {
  useConversions();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const channel = useChannel(`presence-room@${id}`);
  const key = ["conversion", id, session?.user.id];

  useEvent<{ name: string }>(channel, Events.USER_TYPING, (data) => {
    data && updateChat(() => ({ liveAction: `${data.name} is typing...` }));
  });
  useEvent(channel, Events.USER_STOP_TYPING, () => {
    updateChat(() => ({ liveAction: null }));
  });
  useEvent<IMessage>(channel, Events.NEW_CHANNEL_MESSAGE, (newMessage) => {
    if (!newMessage) return;
    const { body, updatedAt } = newMessage;
    queryClient.setQueryData<IMessage[]>(
      ["messages", id, session?.user.id],
      (old) => (newMessage && old ? [...old, newMessage] : old)
    );
    newMessage.fromID !== session?.user.id &&
      updateChat((old) => ({
        lastAction: { body, updatedAt },
        unseenCount: old.unseenCount + 1,
      }));
  });

  function updateChat(updater: (old: IConversion) => any) {
    queryClient.setQueryData<IConversion>(key, (old) => {
      if (!old) return null;
      return { ...old, ...updater(old) };
    });
  }

  const chat = queryClient.getQueryData<IConversion>(key) as IConversion;

  return { ...chat, updateChat };
}

export function useConversions() {
  const { data: session } = useSession();
  const { data: chatIDs } = useQuery({
    queryKey: ["conversions", session?.user.id],
    queryFn: () => fetchConversions(session?.user.id as string),
    enabled: !!session?.user,
    initialData: [],
  });

  const conversions = useQueries({
    queries: chatIDs.map((id) => ({
      queryKey: ["conversion", id, session?.user.id],
      queryFn: () => fetchConversion(session?.user.id as string, id),
    })),
  });

  return conversions;
}
