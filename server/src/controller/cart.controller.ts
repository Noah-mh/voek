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

export const alterQuantCartDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Connected to alterQuant Controller");
  try {
    const { customer_id, sku, quantity } = req.body;
    const response: Array<object> = await cartModel.handleAlterQuantCart(
      customer_id,
      sku,
      quantity
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
export const alterSKUCartDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Connected to alterSKU Controller");
  try {
    const { customer_id, sku, new_sku, product_id } = req.body;
    const response: Array<object> = await cartModel.handleAlterSKUCart(
      customer_id,
      sku,
      new_sku,
      product_id
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const insertCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, customerId, productId, sku  } = req.body;
    const response: number | undefined =
      await cartModel.handlesInsertCart(quantity, customerId, productId, sku);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
