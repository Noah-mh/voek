import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import * as authModel from '../model/auth.model';
import config from '../../config/config';

export const processRefreshTokenCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const result = await authModel.handleRefreshTokenCustomer(refreshToken);
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
            return res.json({ accessToken, customer_id: result[0].customer_id, username: result[0].username });
        })
    } catch (err) {
        return next(err);
    }
}

export const processRefreshSeller = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const result = await authModel.handleRefreshTokenSeller(refreshToken);
        if (!result.length) return res.sendStatus(401);
        jwt.verify(refreshToken, config.refreshTokenSecret!, (err: any, decoded: any) => {
            if (err) return res.sendStatus(401);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: result[0].seller_id,
                        role: "seller"
                    }
                },
                config.accessTokenSecret!,
                { expiresIn: '60s' }
            );
            return res.json({ accessToken, seller_id: result[0].seller_id, shop_name: result[0].shop_name });
        })
    } catch (err) {
        return next(err);
    }
}

