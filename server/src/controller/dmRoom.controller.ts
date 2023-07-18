import { Request, Response, NextFunction } from "express";
import * as dmRoomModel from "../model/dmRoom.model";

interface DMRoom {
  roomID: string;
  customerID: string;
  sellerID: string;
  dateCreated: Date;
}

export const getCustomerRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userID } = req.params;
    if (!userID) return res.sendStatus(400);
    const response: DMRoom[] = await dmRoomModel.getCustomerRooms(userID);
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const getSellerRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userID } = req.params;
    if (!userID) return res.sendStatus(400);
    const response: DMRoom[] = await dmRoomModel.getSellerRooms(userID);
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const createDMRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerID, sellerID } = req.body;
    if (!customerID || !sellerID) return res.sendStatus(400);
    const response: number = await dmRoomModel.createDMRoom(
      customerID,
      sellerID
    );
    console.log("response: ", response);
    if (response === 409) return res.sendStatus(200);
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.params.userID;
    if (!userID) return res.sendStatus(400);
    const response = await dmRoomModel.getCustomer(userID);
    if (!response) return res.sendStatus(404);
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const getSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.params.userID;
    if (!userID) return res.sendStatus(400);
    const response = await dmRoomModel.getSeller(userID);
    if (!response) return res.sendStatus(404);
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export const checkWhetherSellerIsInRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomID, sellerID } = req.query;
    if (!roomID || !sellerID) return res.sendStatus(400);
    const response = await dmRoomModel.checkWhetherSellerIsInRoom(
      roomID as string,
      sellerID as string
    );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
