import {
  useEffect,
  useContext,
  createContext,
  useState,
  PropsWithChildren,
} from "react";
import Pusher from "pusher-js";

type State = Pusher | null;

const PusherContext = createContext<State>(null);

export const usePusher = () => {
  const pusher = useContext(PusherContext);
  return pusher;
};

interface Props {
  params: any;
}

export const PusherProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  params,
}) => {
  const [pusher, setPusher] = useState<State>(null);

  useEffect(() => {
    const pusherInstance = new Pusher("fbade86b34a839940b3f", {
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
    });

    setPusher(pusherInstance);

    return () => {
      pusherInstance.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};
