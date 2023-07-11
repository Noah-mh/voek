import { Express, Router } from "express";
import * as chatMessageController from "../controller/chatMessage.controller";

export default (app: Express, router: Router) => {
  router.get("/getRoomMessages", chatMessageController.getRoomMessages);
  router.post("/createMessage", chatMessageController.createMessage);
};
