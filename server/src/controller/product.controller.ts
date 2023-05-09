import { Request, Response, NextFunction } from "express";
import { handlesGetProductDetails, handlesGetCartDetails, handlesGetRecommendedProductsBasedOnCat, handlesGetWishlistItems, handlesGetLastViewed } from "../model/product.model";

export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    const response: Array<object> = await handlesGetProductDetails(
      productId
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processCartDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body;
    const response: Array<object> = await handlesGetCartDetails(
      customerId
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getRecommendedProductsBasedOnCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.body;
    const response: Array<object> = await handlesGetRecommendedProductsBasedOnCat(
      category_id
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getWishlistItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.body;
    const response: Array<object> = await handlesGetWishlistItems(
      customer_id
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getLastViewed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, date_viewed } = req.body;
    const response: Array<object> = await handlesGetLastViewed(
      customer_id, date_viewed
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

