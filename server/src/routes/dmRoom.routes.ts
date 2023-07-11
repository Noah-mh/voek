import { Express, Router } from "express";
import * as dmRoomController from "../controller/dmRoom.controller";

export default (app: Express, router: Router) => {
  router.get("/getCustomerRooms/:userID", dmRoomController.getCustomerRooms);
  router.get("/getSellerRooms/:userID", dmRoomController.getSellerRooms);
  router.post("/createDMRoom", dmRoomController.createDMRoom);
  router.get("/getCustomer/:userID", dmRoomController.getCustomer);
  router.get("/getSeller/:userID", dmRoomController.getSeller);
};
