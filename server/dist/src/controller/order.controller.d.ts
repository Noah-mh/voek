import { Request, Response, NextFunction } from "express";
export declare const processHandleGetCustomerOrders: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const processhandleGetCustomerDeliveredOrders: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const processGetCustomerReceivedOrders: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const processOrderReceived: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
