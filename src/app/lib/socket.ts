// import Pusher, { Options } from 'pusher-js';
import { PusherProviderProps } from "@harelpls/use-pusher";
import { Options } from "pusher";

export const getPusher = (params: any): PusherProviderProps => {
  return {
    clientKey: "fbade86b34a839940b3f",
    cluster: "ap2",
    authEndpoint: "/api/pusher-auth",
    channelAuthorization: {
      endpoint: "/api/pusher-auth/channel",
      transport: "ajax",
      params,
    },
    userAuthentication: {
      endpoint: "/api/pusher-auth/user",
      transport: "ajax",
      params,
    },
    auth: {
      params,
    },
  };
};
