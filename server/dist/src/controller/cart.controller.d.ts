import { Request, Response, NextFunction } from "express";
export declare const retrieveCartDetails: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const alterCartDetails: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
