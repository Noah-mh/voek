import allowedOrigins from "../../config/allowedOrigin";
import { Request, Response, NextFunction } from "express";

const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin: any = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true.toString());
    }
    next();
}

export default credentials;