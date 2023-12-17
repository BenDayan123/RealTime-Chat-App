"use client";

import { useFriends } from "@hooks/useFriends";
import { NextPage } from "next";
import UserRow from "../UserRow";
import { useEffect, useMemo } from "react";
import { usePusher } from "@hooks/usePusher";

const Page: NextPage = () => {
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  const pusher = usePusher();
  useEffect(() => {
    console.log(pusher?.user.watchlist);
  }, [pusher]);

  const onlineFriends = useMemo(
    () => friends?.filter((friend) => friend.status === "online") ?? [],
    [friends],
  );
  return (
    <div className="p-4">
      <h1 className="px-5 text-xl font-bold text-onBG-light dark:text-onBG-dark">
        Online Friends - {onlineFriends?.length}
      </h1>
      {onlineFriends?.map(({ name, id, image, status }, i) => (
        <UserRow
          className="bg-background-light dark:bg-background-dark"
          name={name}
          key={id || i}
          status={status}
          image={image}
          id={id}
          description={status || "Online"}
        />
      ))}
    </div>
  );
};

export default Page;
