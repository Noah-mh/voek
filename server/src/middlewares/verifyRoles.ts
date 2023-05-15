import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  role?: string;
}

const verifyRoles = (allowedRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req?.role) {
      return res.sendStatus(403);
    }
    if (req.role !== allowedRole) {
      return res.sendStatus(401);
    }
    next();
  };
};

export default verifyRoles;
