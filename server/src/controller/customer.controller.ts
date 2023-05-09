import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import { handleLogin, handleStoreRefreshToken, handleSendSMSOTP, handleSendEmailOTP, handleVerifyOTP, handleSignUp, handleSendEmailLink } from '../model/customer.model';


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
                { expiresIn: '60s' }
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

export const processSendEmailLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, phone_number } = req.body;
        if (!email || !username) return res.sendStatus(400);
        const signUpToken = jwt.sign(
            {
                UserInfo: {
                    email, 
                    username,
                    phone_number
                }
            },
            config.signUpTokenSecret!,
            { expiresIn: '300s' }
        );
        const result = await handleSendEmailLink(signUpToken, email);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSignUpLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { signUpToken } = req.body;
        if (!signUpToken) return res.sendStatus(400);
        jwt.verify(signUpToken, config.signUpTokenSecret as any, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            return res.status(200).json({email: decoded.UserInfo.email, username: decoded.UserInfo.username, phone_number: decoded.UserInfo.phone_number});
        });
    } catch (err: any) {
        return next(err);
    }
}

export const processSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email, phone_number } = req.body;
        if (!username || !password || !email || !phone_number) return res.sendStatus(400);
        const response = await handleSignUp(username, password, email, phone_number);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}