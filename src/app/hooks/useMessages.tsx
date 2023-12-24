// import { useEvent, useChannel } from "@harelpls/use-pusher";
import { IMessage, UserSeenType } from "@interfaces/message";
import { usePusher } from "./usePusher";
import { Events } from "@lib/events";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

async function fetchMessages(channel_id: string, cursor?: number) {
  const res = await axios.get<IMessage[]>(`/api/message`, {
    params: {
      channel_id,
      cursor,
    },
  });
  return res.data;
}

export function useMessages(channel_id: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const pusher = usePusher();
  const key = ["messages", channel_id, session?.user.id];
  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 0 }) => fetchMessages(channel_id, pageParam),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 10 ? pages.length : undefined,
    // (lastPage.length === 0 && pages.length > 0) || pages.length < 10
    //   ? undefined
    //   : pages.length,
  });

  useEffect(() => {
    if (!pusher) return;
    const channel = pusher.subscribe(`presence-room@${channel_id}`);

    channel.bind(
      Events.MESSAGE_SEEN,
      (data: { messages: string[]; seenBy: UserSeenType }) => {
        if (!data) return;
        const { messages: seenMessages, seenBy } = data;
        queryClient.setQueryData<InfiniteData<IMessage[]>>(key, (old) => {
          if (!old) return old;
          const updated = old.pages.map(
            (page) =>
              page.map((message) => ({
                ...message,
                seen: seenMessages.includes(message.id)
                  ? [...(message.seen ?? []), seenBy]
                  : message.seen,
              })) ?? [],
          );
          return { pages: updated, pageParams: old.pageParams };
        });
      },
    );

    channel.bind(Events.MESSAGES_DELETED, (data: string[]) => {
      const deletedMessage = new Set(data);
      queryClient.setQueryData<InfiniteData<IMessage[]>>(
        ["messages", channel_id, session?.user.id],
        (old) => {
          if (!old) return old;
          const updated = old.pages.map((page) =>
            page.filter((message) => {
              if (deletedMessage.has(message.id)) {
                deletedMessage.delete(message.id);
                return false;
              }
              return true;
            }),
          );
          return { pages: updated, pageParams: old.pageParams };
        },
      );
    });

    channel.bind(Events.REACTION_ADDED, (data: any) => {
      const { messageID, emoji, user } = data;
      queryClient.setQueryData<InfiniteData<IMessage[]>>(key, (old) => {
        if (!old) return old;
        const updated = old.pages.map((page) =>
          page.map((message) => {
            if (message.id === messageID) {
              const { reactions } = message;
              return {
                ...message,
                reactions: {
                  ...reactions,
                  [emoji]: (reactions[emoji] ||= []).concat(user),
                },
              };
            }
            return message;
          }),
        );
        return { pages: updated, pageParams: old.pageParams };
      });
    });

    channel.bind(Events.REACTION_REMOVED, (data: any) => {
      const { messageID, emoji, userID } = data;
      queryClient.setQueryData<InfiniteData<IMessage[]>>(key, (old) => {
        if (!old) return old;
        const updated = old.pages.map((page) =>
          page.map((message) => {
            if (message.id === messageID) {
              const { reactions } = message;
              const data: IMessage = {
                ...message,
                reactions: {
                  ...reactions,
                  [emoji]:
                    reactions[emoji]?.filter((user) => user.id !== userID) ??
                    [],
                },
              };
              if (data.reactions[emoji].length === 0)
                delete data.reactions[emoji];
              return data;
            }
            return message;
          }),
        );
        return { pages: updated, pageParams: old.pageParams };
      });
    });

    return () => {
      void channel.unbind(Events.MESSAGE_SEEN);
      void channel.unbind(Events.MESSAGES_DELETED);
      void channel.unbind(Events.REACTION_ADDED);
      void channel.unbind(Events.REACTION_REMOVED);
    };
  }, [pusher, channel_id]);

  return query;
}
