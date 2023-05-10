import { Request, Response, NextFunction } from "express";
import {
  handlesGetProductDetails,
  handlesGetRecommendedProductsBasedOnCat,
  handlesGetWishlistItems,
  handlesGetLastViewed,
  handlesTopProducts,
  handlesSearchBarPredictions,
  handlesSearchResult,
  handlesProductsBasedOnCategory,
  handlesInsertingWishlistedProduct,
  handlesDeletingWishlistedProduct,
} from "../model/product.model";

export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log();
    const { productId } = req.body;
    const response: Array<object> = await handlesGetProductDetails(productId);
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
    const response: Array<object> =
      await handlesGetRecommendedProductsBasedOnCat(category_id);
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
    const response: Array<object> = await handlesGetWishlistItems(customer_id);
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
      customer_id,
      date_viewed
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getTopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response: Array<object> = await handlesTopProducts();
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getSearchBarPredictions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response: Array<object> = await handlesSearchBarPredictions();
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getSearchResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { input } = req.body;
    const response: Array<object> = await handlesSearchResult(input);
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};  

export const getProductsBasedOnCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.body;
    const response: Array<object> = await handlesProductsBasedOnCategory(category_id);
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};  

export const insertWishlistedProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, product_id } = req.body;
    const response: number = await handlesInsertingWishlistedProduct(customer_id, product_id);
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};  

export const deleteWishlistedProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { wishlist_id } = req.body;
    const response: number = await handlesDeletingWishlistedProduct(wishlist_id);
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};  