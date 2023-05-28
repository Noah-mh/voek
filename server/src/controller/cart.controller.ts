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
    const { customer_id } = req.params;

    console.log("Connected to getCart Controller");

    const response: Array<object> = await cartModel.handlesGetCartDetails(
      customer_id
    );

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

export const insertCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, customerId, productId, sku } = req.body;
    const response: number | undefined = await cartModel.handlesInsertCart(
      quantity,
      customerId,
      productId,
      sku
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const insertPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, amount } = req.body;
    const response: number | undefined = await cartModel.handleInsertPayment(
      customer_id,
      amount
    );
    return res.status(201).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const insertOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customer_id,
      payment_id,
      discount_applied,
      coins_redeemed,
      address_id,
    } = req.body;
    const response: number | undefined = await cartModel.handleInsertOrder(
      customer_id,
      payment_id,
      discount_applied,
      coins_redeemed,
      address_id
    );
    return res.status(201).json(response);
  } catch (err: any) {
    return next(err);
  }
};
export const insertOrderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku, orders_id, product_id, totalPrice, quantity, shipment_id } =
      req.body;
    const response: number | undefined =
      await cartModel.handleInsertOrderProduct(
        sku,
        orders_id,
        product_id,
        totalPrice,
        quantity
      );
    return res.status(201).json(response);
  } catch (err: any) {
    return next(err);
  }
};
export const updateProductStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantityDeduct, sku } = req.body;
    const response: Array<object> = await cartModel.handleUpdateProductStock(
      quantityDeduct,
      sku
    );
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const updateCustomerCoins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, coins } = req.body;
    const response: Array<object> = await cartModel.handleAlterCustomerCoins(
      customer_id,
      coins
    );
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};
export const insertShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orders_product_id, customer_id } = req.body;
    const response: Array<object> = await cartModel.handleInsertShipment(
      orders_product_id,
      customer_id
    );
    return res.status(201).json(response);
  } catch (err: any) {
    return next(err);
  }
};
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Connected to clearCart Controller");
  try {
    const { customer_id } = req.body;
    const response: Array<object> = await cartModel.handleClearCart(
      customer_id
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processRedeemVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Connected to processRedeemVoucher Controller");
  try {
    const { order_id, customer_voucher_id } = req.body;
    console.log(order_id, customer_voucher_id);
    const response: Array<object> = await cartModel.handleRedeemVoucher(
      customer_voucher_id,
      order_id
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
// export const alterSKUCartDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("Connected to alterSKU Controller");
//   try {
//     const { customer_id, sku, new_sku, product_id } = req.body;
//     const response: Array<object> = await cartModel.handleAlterSKUCart(
//       customer_id,
//       sku,
//       new_sku,
//       product_id
//     );
//     if (!response?.length) return res.sendStatus(404);
//     return res.sendStatus(200);
//   } catch (err: any) {
//     return next(err);
//   }
// };
