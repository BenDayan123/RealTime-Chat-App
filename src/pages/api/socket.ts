import { NextApiRequest, NextApiResponse } from "next"
import { Server as NetServer } from "http";
import { Server } from "socket.io";
import handlers from "@lib/socket";

// import type { Server as HTTPServer } from "http";
// import type { Socket as NetSocket } from "net";
// import type { Server as IOServer } from "socket.io";

// export interface SocketServer extends HTTPServer {
//   io?: IOServer | undefined;
// }
// export interface SocketWithIO extends NetSocket {
//   server: SocketServer;
// }
// export interface NextApiResponseWithSocket extends NextApiResponse {
//   socket: SocketWithIO;
// }
// export interface ServerToClientEvents {
//   userServerConnection: () => void;
//   hello: (msg: string) => void;
//   userServerDisconnection: (socketid: string) => void;
// }

// export interface ClientToServerEvents {
//   hello: (msg: string) => void;
//   userServerConnection: () => void;
//   userServerDisconnection: (socketid: string) => void;
// }

function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
    if (!(res.socket as any).server.io) {
        console.log("*First use, starting socket.io");
        const io = new Server((res.socket as any).server);
        const { onConnection } = handlers(io);

        io.on("connection", onConnection);
        (res.socket as any).server.io = io;
    }
    else console.log("socket.io already running");
    res.end();
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default SocketHandler;

// 4.20.1