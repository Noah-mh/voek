import { Request, Response, NextFunction } from "express";
import { handelGetProductDetails, handelGetCartDetails } from "../model/product.model";

export const processPublicProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    const response: Array<object> = await handelGetProductDetails(
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
    const response: Array<object> = await handelGetCartDetails(
      customerId
    );
    if (!response?.length) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
