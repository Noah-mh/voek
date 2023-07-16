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

    // socket.on("join_room", (roomID: any) => {
    //   socket.join(roomID);
    //   console.log("User joined room: " + roomID);
    // });

    socket.on("send_message", (data: any) => {
      console.log("chat message: ", data);
      socket.to(data.roomID).emit("receive_message", data);
      // if (data.senderRole == "customer") {
      //   sellerRooms[data.roomID].forEach((sellerID: any) => {
      //     socket.to(sellers[sellerID]).emit("receive_message", data);
      //   });
      // } else {
      //   customerRooms[data.roomID].forEach((customerID: any) => {
      //     socket.to(customers[customerID]).emit("receive_message", data);
      //   });
      // }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
};
