"use client";

import Button from "@components/buttons/button";
import Input from "@components/inputs/input";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { MdSend, MdEmail, MdInfo } from "react-icons/md";

interface Params {
  id: string;
  friendEmail: string;
}

function sendFriendRequest(params: Params) {
  const { id, friendEmail } = params;
  return axios.post(`/api/user/${id}/friends`, { friendEmail });
}

interface Props {
  onSuccess: () => void;
}

const AddFriendForm: React.FC<Props> = ({ onSuccess }) => {
  const { data: session } = useSession();
  const ref = useRef<HTMLInputElement>(null);
  const { error, mutate, isSuccess, isLoading } = useMutation<
    any,
    AxiosError<any>,
    Params
  >({
    mutationFn: ({ id, friendEmail }) => sendFriendRequest({ id, friendEmail }),
  });

  useEffect(() => {
    isSuccess && void onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <div className="text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold">Add Friend</h1>
      <Input ref={ref} name="User's Email" icon={MdEmail} />
      {error?.response && (
        <div
          className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-400/20 dark:text-red-400"
          role="alert"
        >
          <MdInfo size={20} />
          <span>{error.response.data.message}</span>
        </div>
      )}
      <Button
        loading={isLoading}
        onClick={() => {
          mutate({
            id: session?.user.id ?? "",
            friendEmail: ref?.current?.value ?? "",
          });
        }}
        name="Send Friend Request"
        icon={<MdSend size={20} />}
      />
    </div>
  );
};
export default AddFriendForm;
