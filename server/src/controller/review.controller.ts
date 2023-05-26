import { Request, Response, NextFunction } from "express";
import * as reviewModel from "../model/review.model";

export const addingReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id, customer_id, rating, comment, sku } =
      req.body;
    if (!product_id || !customer_id || !rating || !comment || !sku)
      return res.sendStatus(404);
    const response: number = await reviewModel.handleAddingReview(
      product_id,
      customer_id,
      rating,
      comment,
      sku
    );
    if (!response) return res.sendStatus(404);
    return res.json({ response });
  } catch (err: any) {
    return next(err);
  }
};

export const addingReviewImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { review_id, image_url } = req.body;
    if (!review_id || !image_url) return res.sendStatus(404);
    const response: number =
      await reviewModel.handleAddingReviewImages(
        review_id,
        image_url
      );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { review_id, sku } = req.body;
    if (!review_id || !sku) return res.sendStatus(404);
    const promises = [
      reviewModel.handleDeleteReview(review_id, sku),
      reviewModel.handleDeleteReviewImages(review_id),
    ];
    const response = await Promise.all(promises);
    if (!response[0]) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processCustomerRated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orders_product_id, customer_id } = req.params;
    if (!orders_product_id || !customer_id)
      return res.sendStatus(400);
    const response: number = await reviewModel.handleCustomerRated(
      parseInt(orders_product_id),
      parseInt(customer_id)
    );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processGetCustomerRated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    if (!customer_id) return res.sendStatus(400);
    const result = await reviewModel.handleGetCustomerRated(
      parseInt(customer_id)
    );
    return res.json({ rated: result });
  } catch (err: any) {
    return next(err);
  }
};
