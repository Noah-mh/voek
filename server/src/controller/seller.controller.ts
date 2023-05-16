import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import * as sellerModel from "../model/seller.model";

// GET all products from 1 seller
export const processGetAllProductsOfSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId: number = parseInt(req.params.sellerId);
        const response: any = await sellerModel.handleGetAllProducts(sellerId);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// GET order details
export const processGetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ordersId: number = parseInt(req.params.ordersId);
        const response: any = await sellerModel.handleGetOrderDetails(ordersId);
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
        const response: any = await sellerModel.handleVerifyOTP(seller_id, OTP);
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
        const { email, shopName, phone_number, password } = req.body;
        if (!email || !shopName || !phone_number || !password) return res.sendStatus(400);
        const result = await sellerModel.handleSignUp(shopName, password, email, phone_number);
        if (result === 1062) {
            return res.sendStatus(409);
        }
        const signUpToken = jwt.sign(
            {
                seller_id: result
            },
            config.signUpSellerTokenSecret!,
            { expiresIn: '300s' }
        );
        const resul2 = await sellerModel.handleSendEmailLink(signUpToken, email);
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
            const { seller_id } = decoded;
            const result = sellerModel.handleActiveAccount(seller_id)
        });
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

export const processForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return res.sendStatus(400);
        const result: any = await sellerModel.handleForgetPassword(email);
        if (result.length) {
            const forgetPaasswordToken = jwt.sign({ seller_id: result[0].seller_id }
                , config.forgetPasswordSellerTokenSecret!,
                { expiresIn: '300s' }
            );
            await sellerModel.handleSendEmailForgetPassword(forgetPaasswordToken, email);
        }
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    } 
}

export const processForgetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { forgetPasswordToken } = req.body;
        if (!forgetPasswordToken) return res.sendStatus(400);
        jwt.verify(forgetPasswordToken, config.forgetPasswordSellerTokenSecret as any, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            const { seller_id } = decoded;
            return res.json({ seller_id });
        });
    } catch (err: any) {
        return next(err);
    }
}

export const processResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, seller_id } = req.body;
        if (!password || !seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleResetPassword(password, seller_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}