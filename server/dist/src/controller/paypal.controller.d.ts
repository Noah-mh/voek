import { Request, Response } from "express";
export declare const processCreatePaypalOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const processCapturePaypalOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
