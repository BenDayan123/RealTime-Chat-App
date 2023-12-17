"use client";
import { TopNav, Item } from "@components/TopNav";
import Button from "@components/buttons/button";
import AddFriendForm from "./addFriend";
import { Dialog } from "@components/Dialog";
import { useMemo, useState } from "react";
import { useFriends } from "@hooks/useFriends";

// export const metadata = {
//   title: "Chat App | Friends",
// };

export default function FriendsWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const { data: friends } = useFriends({ status: "PENDING" });
  const items = useMemo(
    () => [
      { to: "", text: "All" },
      // { to: "online", text: "Online" },
      { to: "pending", text: "Pending", counter: friends?.length || undefined },
      // { to: "blocked", text: "Blocked" },
    ],
    [friends],
  );

  return (
    <div className="w-fulel h-full p-4 text-white">
      <Dialog show={show} onClose={() => setShow((prev) => !prev)}>
        <AddFriendForm onSuccess={() => setShow(false)} />
      </Dialog>
      <TopNav>
        {items.map(({ to, text, ...item }) => (
          <Item to={`/app/friends/${to}`} key={to} {...item}>
            {text}
          </Item>
        ))}
        <Button
          className="w-fit select-none rounded-md bg-green-500 px-4 text-onSurface-dark hover:bg-green-500 dark:bg-green-500 dark:text-onSurface-dark dark:hover:bg-green-700"
          name="Add Friend"
          onClick={() => setShow(true)}
        />
      </TopNav>
      {children}
    </div>
  );
}
