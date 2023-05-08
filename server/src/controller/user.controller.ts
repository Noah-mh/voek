import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import { handleLogin, handleStoreRefreshToken } from '../model/user.model';


export const processLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    } else {
        try {
            const response: UserInfo | null = await handleLogin(email, password);
            if (response) {
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            email: response.customer_id,
                            customer_id: response.customer_id
                        }
                    },
                    config.accessTokenSecret!,
                    { expiresIn: '20s' }
                );
                const refreshToken = jwt.sign(
                    {
                        UserInfo: {
                            email: response.customer_id,
                            customer_id: response.customer_id
                        }
                    },
                    config.refreshTokenSecret!,
                    { expiresIn: '3600s' }
                );
                await handleStoreRefreshToken(refreshToken, response.customer_id);
                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ accessToken, refreshToken });
            } else {
                res.sendStatus(401);
            }
        } catch (err: any) {
            return next(err);
        }
    }
}