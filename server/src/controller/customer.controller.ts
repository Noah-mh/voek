import jwt from "jsonwebtoken";
import config from "../../config/config";
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";
import * as customerModel from '../model/customer.model';


export const processLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    } else {
        try {
            const response: UserInfo | null = await customerModel.handleLogin(email, password);
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
        const response = await customerModel.handleSendSMSOTP(phoneNumber, customer_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, customer_id } = req.body;
        if (!email || !customer_id) return res.sendStatus(400);
        const response = await customerModel.handleSendEmailOTP(email, customer_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processVerifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id, OTP } = req.body;
        if (!customer_id || !OTP) return res.sendStatus(400);
        const response: any= await customerModel.handleVerifyOTP(customer_id, OTP);
        if (response.length) {
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: response[0].customer_id,
                        role: "customer"
                    }
                },
                config.accessTokenSecret!,
                { expiresIn: '60s' }
            );
            const refreshToken = jwt.sign(
                {
                    UserInfo: {
                        customer_id: response[0].customer_id,
                        role: "customer"
                    }
                },
                config.refreshTokenSecret!,
                { expiresIn: '3600s' }
            );
            await customerModel.handleStoreRefreshToken(refreshToken, response[0].customer_id);
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
        const { email, username, phone_number, password } = req.body;
        if (!email || !username || !phone_number || !password) return res.sendStatus(400);
        const result = await customerModel.handleSignUp(username, password, email, phone_number);
        if (result === 1062) {
            return res.sendStatus(409);
        }
        const signUpToken = jwt.sign({ customer_id: result },
            config.signUpCustomerTokenSecret!,
            { expiresIn: '300s' }
        );
        const result2 = await customerModel.handleSendEmailLink(signUpToken, email);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processSignUpLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { signUpToken } = req.body;
        if (!signUpToken) return res.sendStatus(400);
        jwt.verify(signUpToken, config.signUpCustomerTokenSecret as any, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            const { customer_id } = decoded;
            const result = customerModel.handleActiveAccount(customer_id);
            return res.status(200)
        });
    } catch (err: any) {
        return next(err);
    }
};

export const updateCustLastViewedCat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { cat_id, customer_id } = req.body;
        try {
            const response: number = await customerModel.handlesCustLastViewdCat(
                cat_id,
                customer_id
            );
            console.log(response);
            if (response === 0) return res.sendStatus(404);
            return res.sendStatus(200);
        } catch (err: any) {
            return next(err);
        }
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
};

export const processLogout = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    await customerModel.handleLogOut(refreshToken);
    res.clearCookie('jwt', {
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);
}

export const processForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return res.sendStatus(400);
        const result: any = await customerModel.handleForgetPassword(email);
        if (result.length) {
            const forgetPasswordToken = jwt.sign({ customer_id: result[0].customer_id },
                config.forgetPasswordCustomerTokenSecret!,
                { expiresIn: '300s' }
            );
            await customerModel.handleSendEmailForgetPassword(forgetPasswordToken, email);
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
        jwt.verify(forgetPasswordToken, config.forgetPasswordCustomerTokenSecret as any, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            const { customer_id } = decoded;
            return res.json({ customer_id });
        });
    } catch (err: any) {
        return next(err);
    }
}

export const processResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, customer_id } = req.body;
        if (!password || !customer_id) return res.sendStatus(400);
        const result = await customerModel.handleResetPassword(password, customer_id);
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}