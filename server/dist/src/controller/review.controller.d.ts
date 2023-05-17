import { Request, Response, NextFunction } from "express";
export declare const addingReview: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const addingReviewImages: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
