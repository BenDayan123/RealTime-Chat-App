"use client";

import { FriendShipStatus, IFriend } from "@interfaces/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

async function fetchFriends(id: string, status: FriendShipStatus) {
  const res = await axios.get<IFriend[]>(`/api/user/${id}/friends`, {
    params: { status },
  });
  return res.data;
}
interface Props {
  status?: FriendShipStatus;
}

export function useFriends({ status = "ACCEPTED" }: Props) {
  const { data: session } = useSession();
  const key = ["friends", status, session?.user.id];
  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchFriends(session?.user.id as string, status),
  });
  return { ...query, key };
}

export function useFriend() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    mutate: acceptRequest,
    isLoading,
    error,
    data,
  } = useMutation(
    ({ friendID }: any) => {
      return axios.patch(`/api/user/${session?.user.id}/friends`, undefined, {
        params: { friend: friendID, status: "ACCEPTED" },
      });
    },
    {
      onSuccess({ data }, { friendID }) {
        queryClient.setQueryData(
          ["friends", "PENDING", session?.user.id],
          (old?: IFriend[]) => {
            return old?.filter((friend) => friend.id !== friendID) || [];
          }
        );
        queryClient.setQueryData(
          ["friends", "ACCEPTED", session?.user.id],
          (old?: IFriend[]) => {
            return old ? [data.requestedFrom, ...old] : [];
          }
        );
      },
    }
  );

  return { acceptRequest, isLoading, error, data };
}
