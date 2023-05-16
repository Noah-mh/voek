import { Request, Response, NextFunction } from "express";
import * as orderModel from "../model/order.model";


export const processHandleGetCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id) return res.sendStatus(400);
        const result =  await orderModel.handleGetCustomerOrders(parseInt(customer_id));
        return res.json({ listedOrders: result })
    } catch (err: any) {
        return next(err);
    }
}
