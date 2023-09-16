"use client";

import { NextPage } from "next";
import { useFriends } from "@hooks/useFriends";
import UserItem from "./UserItem";
import { AcceptButton, IgnoreButton } from "./buttons";

const AllFriendsPage: NextPage = () => {
  const { data: friends } = useFriends({ status: "PENDING" });
  return (
    <div className="p-4">
      <h1 className="text-onBG-light px-5 dark:text-onBG-dark">
        All Friends: {friends?.length}
      </h1>
      {friends?.map(({ name, id, image, status }, i) => (
        <UserItem
          className="bg-background-light dark:bg-background-dark"
          name={name}
          key={id || i}
          image={image}
          status={status || "offline"}
          id={id}
          buttons={
            <>
              <AcceptButton userID={id} />
              <IgnoreButton userID={id} />
            </>
          }
          description={status || "Online"}
        />
      ))}
    </div>
  );
};

export default AllFriendsPage;
