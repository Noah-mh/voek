import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import { handleLogin, handleStoreRefreshToken, handleSendSMSOTP, handleSendEmailOTP, handleVerifyOTP } from '../model/customer.model';


export const processLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    } else {
        try {
            const response: UserInfo | null = await handleLogin(email, password);
            if (response) {
                return res.json(response);
            } else {
                res.sendStatus(401);
            }
        } catch (err: any) {
            return next(err);
        }
    }
}

export const processSendSMSOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber, customer_id } = req.body;
        if (!phoneNumber || !customer_id) return res.sendStatus(400);
        const response = await handleSendSMSOTP(phoneNumber, customer_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, customer_id } = req.body;
        if (!email || !customer_id) return res.sendStatus(400);
        const response = await handleSendEmailOTP(email, customer_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processVerifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id, OTP } = req.body;
        if (!customer_id || !OTP) return res.sendStatus(400);
        const response = await handleVerifyOTP(customer_id, OTP);
        if (response.length) {
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: response.customer_id,
                        role: "customer"
                    }
                },
                config.accessTokenSecret!,
                { expiresIn: '20s' }
            );
            const refreshToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: response.customer_id,
                        role: "customer"
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
            res.json({ refreshToken, accessToken })
        } else {
            res.sendStatus(400);
        }
    } catch (err: any) {
        return next(err);
    }
}

