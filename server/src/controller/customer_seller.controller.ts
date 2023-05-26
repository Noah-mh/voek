import { Request, Response, NextFunction } from "express";
import * as customer_sellerModel from "../model/customer_seller.model";

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
    console.log("sellerDetails:", response);
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
    console.log("product_id:", product_id);
    const response: Array<object> =
      await customer_sellerModel.handleSellerDetailsByProductId(
        parseInt(product_id)
      );
    if (!response) return res.sendStatus(404);
    console.log("sellerDetailsByProductId:", response);
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
    console.log("sellerProductsDetails:", response);
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
    console.log("sellerCategories:", response);
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
    console.log("sellerProductsByCategory:", response);
    return res.json({ sellerProductsByCategory: response });
  } catch (err: any) {
    next(err);
  }
};
