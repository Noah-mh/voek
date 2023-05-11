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
  handlesCheckWishlistProductExistence,
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
    if (response.length === 0) return res.sendStatus(404);
    return res.json({ response });
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
    const response: Array<object> = await handlesProductsBasedOnCategory(
      category_id
    );
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
    console.log("test");
    const { customerId, productId } = req.body;
    const response: number = await handlesInsertingWishlistedProduct(
      customerId,
      productId
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(201);
  } catch (err: any) {
    return next(err);
  }
};

export const deleteWishlistedProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("test2");
  try {
    const { customerId, productId } = req.body;
    const response: number = await handlesDeletingWishlistedProduct(
      customerId, productId
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const checkWishListProductExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("test2");
  try {
    const { customerId, productId } = req.body;
    const response: Array<object> = await handlesCheckWishlistProductExistence(
      customerId, productId
    );
    console.log("response in controller: ", response);
    // if (response.length === 0) return res.sendStatus(404);
    // return res.sendStatus(response[0]["COUNT(*)"] === 0 ? 404 : 200);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};
