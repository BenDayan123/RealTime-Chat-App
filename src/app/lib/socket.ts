// import Pusher, { Options } from 'pusher-js';
import { PusherProviderProps } from "@harelpls/use-pusher";

export const getPusher = (params:any): PusherProviderProps => {
    return {
        clientKey: "fbade86b34a839940b3f",
        cluster: "ap2",
        authEndpoint: "/api/pusher-auth",
        userAuthentication: {
          endpoint: "/api/pusher-auth",
          transport: "ajax",
          params
        },
        auth: {
            params
        }
    };
}
