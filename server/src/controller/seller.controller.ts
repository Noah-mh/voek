import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import * as sellerModel from "../model/seller.model";

// GET all products from 1 seller
export const processGetAllProductsOfSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("yes")
        const sellerId: number = parseInt(req.params.sellerId);
        const response: JSON = await sellerModel.handleGetAllProducts(sellerId);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

export const processLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    } else {
        try {
            const response: UserInfo | null = await sellerModel.handleLogin(email, password);
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
        const { phoneNumber, seller_id } = req.body;
        if (!phoneNumber || !seller_id) return res.sendStatus(400);
        const response = await sellerModel.handleSendSMSOTP(phoneNumber, seller_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, seller_id } = req.body;
        if (!email || !seller_id) return res.sendStatus(400);
        const response = await sellerModel.handleSendEmailOTP(email, seller_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processVerifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id, OTP } = req.body;
        if (!seller_id || !OTP) return res.sendStatus(400);
        const response = await sellerModel.handleVerifyOTP(seller_id, OTP);
        if (response.length) {
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        seller_id: response[0].seller_id,
                        role: "seller"
                    }
                },
                config.accessTokenSecret!,
                { expiresIn: '60s' }
            );
            const refreshToken = jwt.sign(
                {
                    UserInfo: {
                        seller_id: response[0].seller_id,
                        role: "seller"
                    }
                },
                config.refreshTokenSecret!,
                { expiresIn: '3600s' }
            );
            await sellerModel.handleStoreRefreshToken(refreshToken, response[0].seller_id);
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
        const { email, shopName, phone_number } = req.body;
        if (!email || !shopName || !phone_number) return res.sendStatus(400);
        const signUpToken = jwt.sign(
            {
                UserInfo: {
                    email, 
                    shopName,
                    phone_number
                }
            },
            config.signUpSellerTokenSecret!,
            { expiresIn: '300s' }
        );
        const result = await sellerModel.handleSendEmailLink(signUpToken, email);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSignUpLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { signUpToken } = req.body;
        if (!signUpToken) return res.sendStatus(400);
        jwt.verify(signUpToken, config.signUpSellerTokenSecret as any, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            return res.status(200).json({email: decoded.UserInfo.email, phone_number: decoded.UserInfo.phone_number});
        });
    } catch (err: any) {
        return next(err);
    }
}

export const processSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shopName, password, email, phone_number } = req.body;
        if (!shopName || !password || !email || !phone_number) return res.sendStatus(400);
        const response = await sellerModel.handleSignUp(shopName, password, email, phone_number);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processLogout = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    await sellerModel.handleLogOut(refreshToken);
    res.clearCookie('jwt', {
        httpOnly: true
        , sameSite: "none",
        secure: true
    });
    res.sendStatus(204);
}