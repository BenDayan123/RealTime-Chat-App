"use client";

import Button from "@components/buttons/button";
import Input from "@components/inputs/input";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { MdSend, MdEmail } from "react-icons/md";

interface Params {
  id: string;
  friendEmail: string;
}

function sendFriendRequest(params: Params) {
  const { id, friendEmail } = params;
  return axios.post(`/api/user/${id}/friends`, { friendEmail });
}

export default function Page() {
  const { data: session } = useSession();
  const ref = useRef<HTMLInputElement>(null);
  const { error, mutate } = useMutation<any, AxiosError<any>, Params>({
    mutationFn: ({ id, friendEmail }) => sendFriendRequest({ id, friendEmail }),
  });

  return (
    <div>
      <Input ref={ref} name="User's Email" icon={MdEmail} />
      {error?.response && (
        <p className="text-red-600 p-2 my-3 w-fit rounded-md bg-red-200">
          {error.response.data.message}
        </p>
      )}
      <Button
        className="w-1/4 my-3"
        onClick={() => {
          mutate({
            id: session?.user.id || "",
            friendEmail: ref?.current?.value || "",
          });
        }}
        name="Send Friend Request"
        icon={MdSend}
      />
    </div>
  );
}
