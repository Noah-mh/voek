import { Request, Response, NextFunction } from "express";
import * as productModel from "../model/product.model";
//Noah
export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log();
    const { productId } = req.body;
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
    const { category_id } = req.body;
    const response: Array<object> =
      await productModel.handlesGetRecommendedProductsBasedOnCat(
        category_id
      );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getRecommendedProductBasedOnCatWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    const categoryId = parseInt(category_id);
    const response: Array<object> =
      await productModel.handlesGetRecommendedProductBasedOnCatWishlist(categoryId);
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
    const { customerId } = req.body;
    const response: Array<object> =
      await productModel.handlesGetWishlistItems(customerId);
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
    const { customerId, dateViewed } = req.body;
    const response: Array<object> =
      await productModel.handlesGetLastViewed(customerId, dateViewed);
    // if (!response?.length) return res.sendStatus(404);
    // return res.sendStatus(200);
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
    const response: Array<object> =
      await productModel.handlesSearchBarPredictions();
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
    const response: Array<object> =
      await productModel.handlesSearchResult(input);
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
    console.log("test");
    const { customerId, productId } = req.body;
    const response: number =
      await productModel.handlesInsertingWishlistedProduct(
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
    const response: number =
      await productModel.handlesDeletingWishlistedProduct(
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

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id: number = parseInt(req.params.product_id);

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
    const { customerId, productId } = req.body;
    const response: Array<object> =
      await productModel.handlesCheckWishlistProductExistence(
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
      await productModel.handlesGetProductVariationsPricing(productId);
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
    const productId: number = parseInt(sku);
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
    const { productId, categoryId, customerId } = req.body;
    const response: Array<object> =
      await productModel.handlesInsertLastViewedProduct(productId, categoryId, customerId);
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

//Noah
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, customer_id, product_id, sku } = req.body;
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
