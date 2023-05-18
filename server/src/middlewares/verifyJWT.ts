import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken extends JwtPayload {
    UserInfo: {
        customer_id?: string;
        seller_id?: string;
        role: string;
    };
}

interface AuthenticatedRequest extends Request {
    user_id?: string;
    role?: string;
}

const verifyJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader: string | undefined =
        req.headers.authorization ?? req.headers.Authorization as string;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];


    jwt.verify(token, config.accessTokenSecret!, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const decodedToken = decoded as DecodedToken;
        req.user_id = decodedToken.UserInfo.customer_id || decodedToken.UserInfo.seller_id;
        req.role = decodedToken.UserInfo.role;

        next();
    });
};

export default verifyJWT;
