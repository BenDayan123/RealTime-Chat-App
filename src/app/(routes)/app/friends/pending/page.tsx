"use client";

import { useFriends } from "@hooks/useFriends";
import { NextPage } from "next";
import UserRow from "../UserRow";
import { AcceptButton, IgnoreButton } from "../buttons";

const Page: NextPage = () => {
  const { data: friends } = useFriends({ status: "PENDING" });
  if (!friends) return null;

  return (
    <div className="p-4">
      <h1 className="px-5 text-2xl font-bold text-onBG-light dark:text-onBG-dark">
        All Requests - {friends?.length}
      </h1>
      {friends?.map(({ name, id, image, type }, i) => (
        <UserRow
          className="bg-background-light dark:bg-background-dark"
          name={name}
          key={id ?? i}
          image={image}
          id={id}
          description={`${type} Request`}
        >
          {type === "ingoing" && (
            <>
              <AcceptButton userID={id} />
              <IgnoreButton userID={id} />
            </>
          )}
        </UserRow>
      ))}
    </div>
  );
};

export default Page;
