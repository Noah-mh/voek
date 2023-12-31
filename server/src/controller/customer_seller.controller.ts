import { Request, Response, NextFunction } from "express";
import * as customer_sellerModel from "../model/customer_seller.model";
//Noah's code
export const getSellerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seller_id } = req.params;
    const response: Array<object> =
      await customer_sellerModel.handleSellerDetailsBySellerId(
        parseInt(seller_id)
      );
    if (!response) return res.sendStatus(404);
    return res.json({ sellerDetails: response });
  } catch (err: any) {
    next(err);
  }
};

export const getSellerDetailsByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id } = req.params;
    const response: Array<object> =
      await customer_sellerModel.handleSellerDetailsByProductId(
        parseInt(product_id)
      );
    if (!response) return res.sendStatus(404);
    return res.json({ sellerDetailsByProductId: response });
  } catch (err: any) {
    next(err);
  }
};

export const getSellerProductsDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seller_id } = req.params;
    const response: Array<object> =
      await customer_sellerModel.handleSellerProductsDetails(
        parseInt(seller_id)
      );
    if (!response) return res.sendStatus(404);
    return res.json({ sellerProductsDetails: response });
  } catch (err: any) {
    next(err);
  }
};

export const getSellerCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seller_id } = req.params;
    const response: Array<object> =
      await customer_sellerModel.handleSellerCategories(
        parseInt(seller_id)
      );
    if (!response) return res.sendStatus(404);
    return res.json({ sellerCategories: response });
  } catch (err: any) {
    next(err);
  }
};

export const getSellerProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { seller_id, category_id } = req.params;
    const response: Array<object> =
      await customer_sellerModel.handleSellerProductsByCategory(
        parseInt(seller_id),
        parseInt(category_id)
      );
    if (!response) return res.sendStatus(404);
    return res.json({ sellerProductsByCategory: response });
  } catch (err: any) {
    next(err);
  }
};
