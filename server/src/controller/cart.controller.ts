import jwt from "jsonwebtoken";
import config from "../../config/config";
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";
import * as cartModel from "../model/cart.model";

export const retrieveCartDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.body;

    console.log("Connected to Controller");

    const response: Array<object> = await cartModel.handlesGetCartDetails(
      parseInt(customer_id)
    );
    if (!response?.length) return res.sendStatus(404);
    return res.json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const alterCartDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, sku, quantity, new_sku, product_id } = req.body;
    const response: Array<object> = await cartModel.handleAlterCart(
      customer_id,
      sku,
      quantity,
      new_sku,
      product_id
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
