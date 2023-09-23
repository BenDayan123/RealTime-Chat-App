import { IConversion } from "@interfaces/conversion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

async function fetchConversions(id: string) {
  const res = await axios.get<IConversion[]>(`/api/user/${id}/conversions`);
  return res.data;
}
export function useConversions() {
  const { data: session } = useSession();
  // const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["conversions", session?.user.id],
    queryFn: () => fetchConversions(session?.user.id as string),
  });

  return query;
}
