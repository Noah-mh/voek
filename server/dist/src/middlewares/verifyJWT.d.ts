import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user_id?: string;
    role?: string;
}
declare const verifyJWT: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default verifyJWT;
