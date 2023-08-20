import { Redis } from "ioredis";
import { Socket, Server } from "socket.io";

const redis = new Redis();

export default (io: Server) =>{
    const onConnection = async (socket: Socket) => {
        const { user } = socket.handshake.query as any;
        console.log(`connection - ${socket.id} (${user})`);
        await redis.hset("sockets", user, socket.id)
        socket.on("message", async (data) => {
            const { chatID, message } = data;
            console.log(message)
            io.to(chatID).emit("new_message", { id: socket.id, sender: user, body: message });
        });
        socket.on('joinRoom', (room) => {
            socket.join(room);
        });
        socket.on("disconnect", async () => {
            console.log(`${socket.id} disconnected`);
            await redis.hdel("sockets", user);
        });
    }
    return { onConnection }
}