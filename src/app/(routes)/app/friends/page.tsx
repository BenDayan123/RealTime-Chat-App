"use client";

import { useRef } from "react";
import Button from "@components/buttons/button";
import Input from "@components/inputs/input";
import { MdSend, MdEmail } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";

async function sendFriendRequest(id: string, friendEmail: string) {
  const res = await axios.post(`/api/user/${id}/friends`, { friendEmail });
  return res.data;
}

export default function FriendsWindow() {
  const { data: session } = useSession();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 w-full h-full text-white">
      <Input ref={ref} name="User's Email" icon={MdEmail} />
      <Button
        className="w-1/4"
        onClick={() => {
          sendFriendRequest(session?.user.id || "", ref?.current?.value ?? "");
        }}
        name="Send Friend Request"
        icon={MdSend}
      />
    </div>
  );
}
