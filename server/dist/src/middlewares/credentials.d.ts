import { Request, Response, NextFunction } from "express";
declare const credentials: (req: Request, res: Response, next: NextFunction) => void;
export default credentials;
