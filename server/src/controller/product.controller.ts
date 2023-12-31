import { Request, Response, NextFunction } from "express";
import * as productModel from "../model/product.model";
//Noah
export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.sendStatus(404);
    const response: Array<object> =
      await productModel.handlesGetProductDetails(productId);
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
    const { category_id } = req.params;
    const categoryId = parseInt(category_id);
    const response: Array<object> = isNaN(categoryId)
      ? []
      : await productModel.handlesGetRecommendedProductsBasedOnCat(
          categoryId
        );
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getRecommendedProductsBasedOnCatWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    const categoryId = parseInt(category_id);
    const response: Array<object> =
      await productModel.handlesGetRecommendedProductsBasedOnCatWishlist(
        categoryId
      );
    return res.send(response);
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
    const { customerId } = req.params;
    const response: Array<object> =
      await productModel.handlesGetWishlistItems(
        parseInt(customerId as string)
      );
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getLastViewedProductExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, productId, timezone, dateViewed } = req.query;
    const response: Array<object> =
      await productModel.handlesGetLastViewedProductExistence(
        parseInt(customerId as string),
        parseInt(productId as string),
        timezone as string,
        dateViewed as string
      );
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
    const { customerId, dateViewed, timezone } = req.query;
    const response: Array<object> =
      await productModel.handlesGetLastViewed(
        parseInt(customerId as string),
        timezone as string,
        dateViewed as string
      );
    return res.send(response);
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
    const response: Array<object> =
      await productModel.handlesTopProducts();
    return res.send(response);
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
    const { input } = req.params;
    const response: Array<object> =
      await productModel.handlesSearchResult(
        input == undefined ? "" : input
      );
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
    const response: Array<object> =
      await productModel.handlesProductsBasedOnCategory(category_id);
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
    const { customerId, productId } = req.body;
    const response =
      await productModel.handlesInsertingWishlistedProduct(
        customerId,
        productId
      );
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(201);
  } catch (err: any) {
    console.error(
      "Unexpected error for insertWishlistedProduct",
      err
    );
    return next(err);
  }
};

export const deleteWishlistedProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, product_id } = req.query;
    const customerId: number = parseInt(customer_id as string);
    const productId: number = parseInt(product_id as string);
    const response: number =
      await productModel.handlesDeleteWishlistedProduct(
        customerId,
        productId
      );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const getProductDetailsWithoutReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id: number = parseInt(req.params.product_id);
    if (!product_id) return res.sendStatus(404);
    const response: Array<object> =
      await productModel.handleProductDetailsWithoutReviews(
        product_id
      );
    if (!response?.length) return res.sendStatus(404);
    return res.json({ products: response });
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id: number = parseInt(req.params.product_id);
    if (!product_id) return res.sendStatus(404);
    const response: Array<object> =
      await productModel.handleProductReviews(product_id);
    if (!response?.length) return res.sendStatus(404);
    return res.json({ reviews: response });
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
    const { customerId, productId } = req.query;
    const response: Array<object> =
      await productModel.handlesCheckWishlistProductExistence(
        parseInt(customerId as string),
        parseInt(productId as string)
      );
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
    const response: Array<object> =
      await productModel.handlesGetAllListedProducts();
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductVariations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_Id } = req.params;
    const productId: number = parseInt(product_Id);
    const response: Array<object> =
      await productModel.handlesGetProductVariations(productId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductVariationsPricing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_Id } = req.params;
    const productId: number = parseInt(product_Id);
    const response: Array<object> =
      await productModel.handlesGetProductVariationsPricing(
        productId
      );
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_Id } = req.params;
    const productId: number = parseInt(product_Id);
    const response: Array<object> =
      await productModel.handlesGetProductImage(productId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductVariationImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku } = req.params;
    const response: Array<object> =
      await productModel.handlesGetProductVariationImage(sku);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const insertLastViewedProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, customerId, currentDate, timezone } = req.body;
    const response: Array<object> =
      await productModel.handlesInsertLastViewedProduct(
        productId,
        customerId,
        currentDate,
        timezone
      );
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductsUsingCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    const categoryId: number = parseInt(category_id);
    const response: Array<object> =
      await productModel.handlesGetProductsUsingCategory(categoryId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id } = req.params;
    const productId: number = parseInt(product_id);
    const response: Array<object> =
      await productModel.handlesGetProductCat(productId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getProductRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id } = req.params;
    const productId: number = parseInt(product_id);
    const response: Array<object> =
      await productModel.handlesGetProductRating(productId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, customer_id, product_id, sku } = req.body;
    if (!quantity || !customer_id || !product_id || !sku)
      return res.sendStatus(404);
    const response: number = await productModel.handleAddToCart(
      quantity,
      customer_id,
      product_id,
      sku
    );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    return next(err);
  }
};

//Noah
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const { sku } = req.query;
    if (!customer_id || !sku) return res.sendStatus(404);
    const response: Array<object> =
      await productModel.handleCartDetails(
        parseInt(customer_id),
        sku as string
      );
    if (!response) return res.sendStatus(404);
    return res.json({ cartDetails: response });
  } catch (err: any) {
    return next(err);
  }
};
