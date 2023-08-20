"use client";

import { useSession } from "next-auth/react";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { IFriend } from "@interfaces/user";

type IContext = IFriend[];

const ConversionContext = createContext<IContext>([]);

export function useConversions() {
  return React.useContext(ConversionContext);
}

export const ConversionsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { data } = useSession();
  // const friends = getFriends();

  // async function getFriends():Promise<IContext> {
  //   const res = await fetch(`/user/${data?.user.id}/friends`)
  //   if (!res.ok)
  //     throw new Error('Failed to fetch data')
  //   return res.json()
  // }

  return (
    <ConversionContext.Provider value={[]}>
      {children}
    </ConversionContext.Provider>
  );
};
