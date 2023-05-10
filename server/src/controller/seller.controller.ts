import { Request, Response, NextFunction } from "express"
import { handleGetAllProducts } from "../model/seller.model";

// GET all products from 1 seller
export const processGetAllProductsOfSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("yes")
        const sellerId: number = parseInt(req.params.sellerId);
        const response: JSON = await handleGetAllProducts(sellerId);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// module.exports = app;