import jwt from "jsonwebtoken";
import config from "../../config/config";
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";
import {
    handlesGetCartDetails
} from "../model/cart.model";

export const processCartDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { customerId } = req.body;
      const response: Array<object> = await handlesGetCartDetails(customerId);
      if (!response?.length) return res.sendStatus(404);
      return res.sendStatus(200);
    } catch (err: any) {
      return next(err);
    }
  };
  