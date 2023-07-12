import { Request, Response, NextFunction } from "express";
import * as chatMessageModel from "../model/chatMessage.model";

interface ChatMessage {
  cmID: string;
  roomID: string;
  senderID: string;
  text: string;
  image: string;
  status: string;
  dateCreated: string;
}

export const getRoomMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomID, timezone } = req.query;
    if (!roomID || !timezone) return res.sendStatus(400);
    console.log(roomID, timezone);
    const response: ChatMessage[] | null =
      await chatMessageModel.getRoomMessages(
        roomID as string,
        timezone as string
      );
    console.log(response);
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomID, senderID, senderRole, text, image } = req.body;
    if (!roomID || !senderID || !senderRole) return res.sendStatus(400);
    const response: number = await chatMessageModel.createMessage(
      roomID,
      senderID,
      senderRole,
      text,
      image
    );
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export const getUserUnreadMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomID, senderID } = req.query;
    if (!roomID || !senderID) return res.sendStatus(400);
    const response: ChatMessage[] | null =
      await chatMessageModel.getUserUnreadMessages(
        roomID as string,
        senderID as string
      );
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const updateMessagesStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomID, senderID } = req.body;
    if (!roomID || !senderID) return res.sendStatus(400);
    const response: number = await chatMessageModel.updateMessagesStatus(
      roomID as string,
      senderID as string
    );
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
