"use client";

import { NextPage } from "next";
import { useFriends } from "@hooks/useFriends";
import UserRow from "./UserRow";

const AllFriendsPage: NextPage = () => {
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  return (
    <div className="p-4">
      <h1 className="px-5 text-xl font-bold text-onBG-light dark:text-onBG-dark">
        All Friends - {friends?.length}
      </h1>
      {friends?.map(({ name, id, image, status }, i) => (
        <UserRow
          className="bg-background-light dark:bg-background-dark"
          name={name}
          key={id || i}
          status={status ?? "offline"}
          image={image}
          id={id}
          description={status || "Online"}
        />
      ))}
    </div>
  );
};

export default AllFriendsPage;
