import { IConversion } from "@interfaces/conversion";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo } from "react";

async function fetchConversions(id: string) {
  const res = await axios.get<string[]>(`/api/user/${id}/conversions`);
  return res.data;
}
async function fetchConversion(user: string, chat: string) {
  const res = await axios.get<IConversion>(
    `/api/user/${user}/conversions/${chat}`,
  );
  return res.data;
}

export function useConversion(id: string) {
  useConversions();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const key = ["conversion", id, session?.user.id];

  function updateChat(updater: (old: IConversion) => any) {
    queryClient.setQueryData<IConversion>(key, (old) => {
      if (!old) return null;
      return { ...old, ...updater(old) };
    });
  }

  const chat = queryClient.getQueryData<IConversion>(key) as IConversion;
  const isAdmin =
    chat?.admins.find((admin) => admin.id === session?.user.id) ?? false;
  return { ...chat, isAdmin, updateChat };
}

export function useConversions() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: chatIDs, refetch } = useQuery({
    queryKey: ["conversions", session?.user.id],
    queryFn: () => fetchConversions(session?.user.id as string),
    enabled: !!session?.user,
    initialData: [],
  });

  const moveChatToTop = useCallback((id: string) => {
    queryClient.setQueryData<string[]>(
      ["conversions", session?.user.id],
      (old) => {
        if (!old) return old;
        return old.sort((x, y) => (x === id ? -1 : y === id ? 1 : 0));
      },
    );
  }, []);
  const conversions = useQueries({
    queries: chatIDs.map((id) => ({
      queryKey: ["conversion", id, session?.user.id],
      queryFn: () => fetchConversion(session?.user.id as string, id),
    })),
  });

  return { conversions, chatIDs, refetchIDs: refetch, moveChatToTop };
}
