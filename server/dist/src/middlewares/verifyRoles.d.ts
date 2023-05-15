import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    role?: string;
}
declare const verifyRoles: (allowedRole: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default verifyRoles;
