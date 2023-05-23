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
    const response: number = await reviewModel.handleDeleteReview(
      review_id,
      sku
    );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};