// import Pusher from "pusher-js";
import PusherServer from "pusher";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } =
  process.env;

export const pusher = new PusherServer({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

// export const getClientPusher = (params: any) => {
//   return new Pusher("fbade86b34a839940b3f", {
//     cluster: "ap2",
//     authEndpoint: "/api/pusher-auth",
//     channelAuthorization: {
//       endpoint: "/api/pusher-auth/channel",
//       transport: "ajax",
//       params,
//     },
//     userAuthentication: {
//       endpoint: "/api/pusher-auth/user",
//       transport: "ajax",
//       params,
//     },
//     auth: {
//       params,
//     },
//   });
// };
