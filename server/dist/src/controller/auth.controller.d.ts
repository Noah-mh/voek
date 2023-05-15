import { Request, Response, NextFunction } from "express";
export declare const processRefreshTokenCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const processRefreshSeller: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
