import { Request, Response, NextFunction } from "express";
import * as productModel from "../model/product.model";

export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log();
    const { productId } = req.body;
    const response: Array<object> = await productModel.handlesGetProductDetails(productId);
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
      await productModel.handlesGetRecommendedProductsBasedOnCat(category_id);
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
    const { customerId } = req.body;
    const response: Array<object> = await productModel.handlesGetWishlistItems(customerId);
    console.log("resonse", response);
    return res.send(response);
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
    const response: Array<object> = await productModel.handlesGetLastViewed(
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
    const response: Array<object> = await productModel.handlesTopProducts();
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
    const response: Array<object> = await productModel.handlesSearchBarPredictions();
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
    const response: Array<object> = await productModel.handlesSearchResult(input);
    return res.send(response);
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
    const response: Array<object> = await productModel.handlesProductsBasedOnCategory(
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
    const response: number = await productModel.handlesInsertingWishlistedProduct(
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
  try {
    const { customerId, productId } = req.body;
    const response: number = await productModel.handlesDeletingWishlistedProduct(
      customerId,
      productId
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductDetailsWithoutReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id: number = parseInt(req.params.product_id);

    const response: Array<object> = await productModel.handleProductDetailsWithoutReviews(
      product_id
    );
    if (!response?.length) return res.sendStatus(404);
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id: number = parseInt(req.params.product_id);

    const response: Array<object> = await productModel.handleProductReviews(product_id);
    if (!response?.length) return res.sendStatus(404);
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const checkWishListProductExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, productId } = req.body;
    const response: Array<object> = await productModel.handlesCheckWishlistProductExistence(
      customerId,
      productId
    );
    // if (response.length === 0) return res.sendStatus(404);
    // return res.sendStatus(response[0]["COUNT(*)"] === 0 ? 404 : 200);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getAllListedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response: Array<object> = await productModel.handlesGetAllListedProducts();
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};
