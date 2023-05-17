import * as paypalModel from "../model/paypal.model";
import { Request, Response } from "express";

export const processCreatePaypalOrder = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;
        const order = await paypalModel.createOrder(amount);
        return res.json(order);
    } catch (err: any) {
        return res.status(500).send("error msg:" + err.message);
    }
}

export const processCapturePaypalOrder = async (req: Request, res: Response) => {
    const { orderID } = req.body;
    try {
        const captureData = await paypalModel.capturePayment(orderID);
        return res.json(captureData);
    } catch (err: any) {
        return res.status(500).send(err.message);
    }
}