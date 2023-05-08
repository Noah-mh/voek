import { Request, Response, NextFunction } from "express";
import { getProductDetails } from "../model/product.model";

export const publicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    const response: Array<object> = await getProductDetails(
      productId
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
