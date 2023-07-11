import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

export default (server: HttpServer, port: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: any) => {
    console.log("a user connected: ", socket.id);

    socket.on("join_room", (roomID: any) => {
      socket.join(roomID);
      console.log("User joined room: " + roomID);
    });

    socket.on("send_message", (data: any) => {
      console.log("chat message: ", data);
      socket.to(data.roomID).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
};
