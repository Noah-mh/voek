import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { handleRefreshTokenCustomer } from '../model/auth.model';
import config from '../../config/config';

export const processRefreshTokenCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    console.log(req.cookies)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const result = await handleRefreshTokenCustomer(refreshToken);
        if (!result.length) return res.sendStatus(401);
        jwt.verify(refreshToken, config.refreshTokenSecret!, (err: any, decoded: any) => {
            if (err) return res.sendStatus(401);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: result[0].customer_id,
                        role: "customer"
                    }
                },
                config.accessTokenSecret!,
                { expiresIn: '60s' }
            );
            return res.json({ accessToken });
        })
    } catch (err) {
        return next(err);
    }
}