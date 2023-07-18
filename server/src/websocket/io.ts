import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import * as dmRoomModel from "../model/dmRoom.model";

export default (server: HttpServer, port: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  // const customerRooms: any = {
  //   30: [{ roomID: 1 }, { roomID: 2 }, { roomID: 4 }],
  // }; // customerId to room
  // const sellerRooms: any = {
  //   1: [{ roomID: 1 }],
  //   2: [{ roomID: 2 }],
  //   9: [{ roomID: 4 }],
  // }; // customerId to room

  io.on("connection", async (socket: any) => {
    console.log("a user connected: ", socket.id, socket.handshake.query);
    const userID = socket.handshake.query.userID;
    const rooms =
      socket.handshake.query.userType === "customer"
        ? await dmRoomModel.getCustomerRooms(userID)
        : await dmRoomModel.getSellerRooms(userID);

    if (rooms) {
      rooms.forEach((room: any) => {
        console.log("User joined room: ", userID, room.roomID);
        socket.join(room.roomID);
      });
    }

    // socket.on("createSocketConnection", (data: any) => {
    //   const connectionId = data.userID + "_" + data.userType;
    //   socket.join(connectionId);
    //   if (data.userType === "customer") {
    //     customers[data.userID] = connectionId;
    //   } else {
    //     sellers[data.userID] = connectionId;
    //   }

    //   console.log("User open connection: " + connectionId);
    // });

    socket.on("join_room", (roomID: any) => {
      socket.join(roomID);
      console.log("User joined room: " + roomID);
    });

    socket.on("send_message", async (data: any) => {
      console.log("chat message: ", data);

      if (data.senderRole === "customer") {
        console.log("customer message");
        const room = await dmRoomModel.getDMRoomByID(data.roomID);
        if (!room) {
          console.log("room not found");
          return;
        }

        if (room.contacted === 0) {
          io.sockets.emit("broadcast_message", data);
          await dmRoomModel.updateDMRoomContacted(room.roomID);
          console.log("message broadcasted");
        }
      }

      socket.to(data.roomID).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
};
