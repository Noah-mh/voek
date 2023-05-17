import { Request, Response, NextFunction } from "express";
import * as orderModel from "../model/order.model";


export const processHandleGetCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id) return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerOrders(parseInt(customer_id));
        return res.json({ listedOrders: result })
    } catch (err: any) {
        return next(err);
    }
}

export const processhandleGetCustomerDeliveredOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id) return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerDeliveredOrders(parseInt(customer_id));
        return res.json({ listedOrdersDelivered: result })
    } catch (err: any) {
        return next(err);
    }
}

export const processGetCustomerReceivedOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id) return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerReceivedOrders(parseInt(customer_id));
        return res.json({ listedOrdersReceived: result })
    } catch (err: any) {
        return next(err);
    }
}

export const processOrderReceived = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orders_product_id } = req.params;
        if (!orders_product_id) return res.sendStatus(400);
        const result = await orderModel.handleOrderReceived(parseInt(orders_product_id));
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}