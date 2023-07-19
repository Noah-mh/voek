import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { UserInfo } from '../interfaces/interfaces';
import { Request, Response, NextFunction } from "express";
import * as sellerModel from "../model/seller.model";
import { parse } from 'path';
import { P } from 'pino';

// GET all products from 1 seller
export const processGetAllProductsOfSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId: number = parseInt(req.params.sellerId);
        const response: any = await sellerModel.handleGetAllProductsOfSeller(sellerId);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// GET best sellers
export const processGetBestSellers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId: number = parseInt(req.params.sellerId);
        const response: any = await sellerModel.handleGetBestSellers(sellerId);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// GET all categories
export const processGetAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: any = await sellerModel.handleGetAllCategories();
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// POST insert a new product
export const processAddProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId: number = parseInt(req.params.sellerId);
        const { name, description, categoryId, variations, quantity, price, imageUrl } = req.body;
        if (!name || !categoryId || !quantity || !price || !imageUrl) return res.sendStatus(400);
        const response: any = await sellerModel.handleAddProduct(sellerId, name, description, categoryId, variations, quantity, price, imageUrl);
        return res.json({ productId: response });
    } catch (err: any) {
        return next(err);
    }
}

// POST update product
export const processEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId: number = parseInt(req.params.productId);
        const { values, variations } = req.body;
        if (!values || !variations) return res.sendStatus(400);
        const response: any = await sellerModel.handleEditProduct(sellerId, values, variations);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// PUT product variation active
export const processUpdateProductVariationActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId: number = parseInt(req.params.productId);
        const { active, sku } = req.body;
        const response: any = await sellerModel.handleUpdateProductVariationActive(active, productId, sku);
        return res.json(response);
    } catch (err: any) {
        return next(err);
    }
}

// PUT product active
export const processUpdateProductActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId: number = parseInt(req.params.productId);
        const { active } = req.body;
        const response: any = await sellerModel.handleUpdateProductActive(active, productId);
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
            const response: any = await sellerModel.handleLogin(email, password);
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
                { expiresIn: '300s' }
            );
            const refreshToken = jwt.sign(
                {
                    UserInfo: {
                        seller_id: response[0].seller_id,
                        role: "seller"
                    }
                },
                config.refreshTokenSecret!,
                { expiresIn: '7d' }
            );
            await sellerModel.handleStoreRefreshToken(refreshToken, response[0].seller_id);
            res.cookie('sellerJwt', refreshToken, {
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
    if (!cookies?.sellerJwt) return res.sendStatus(204);
    const refreshToken = cookies.sellerJwt;
    await sellerModel.handleLogOut(refreshToken);
    res.clearCookie('sellerJwt', {
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

export const processGetSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerOrders(seller_id);
        return res.json({ orders: result });
    } catch (err: any) {
        return next(err);
    }
}

export const processGetSellerShipped = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerShipped(seller_id);
        return res.json({ shipped: result });
    } catch (err: any) {
        return next(err);
    }
}

export const processGetSellerDelivered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerDelivered(seller_id);
        return res.json({ delivered: result });
    } catch (err: any) {
        return next(err);
    }
}

export const processPackedAndShipped = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orders_product_id, customer_id } = req.body;
        if (!orders_product_id || !customer_id) return res.sendStatus(400);
        await sellerModel.handlePackedAndShipped(orders_product_id, customer_id);
        return res.sendStatus(201);
    } catch (err: any) {
        return next(err);
    }
}

export const processGetCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id, orders_id } = req.params;
        if (!seller_id || !orders_id) return res.sendStatus(400);
        const result = await sellerModel.handleGetCustomerOrders(parseInt(seller_id), parseInt(orders_id));
        return res.json({ orders: result });
    } catch (err: any) {
        return next(err);
    }
}

export const processGetSellerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerDetails(parseInt(seller_id));
        return res.json({ sellerDetails: result });
    } catch (err: any) {
        return next(err);
    }
}

export const processUpdateSellerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, email, shop_name, phone_number } = req.body;
        const { seller_id } = req.params;
        if (!seller_id) return res.sendStatus(400);
        const result = await sellerModel.handleUpdateSellerDetails(password, email, shop_name, parseInt(phone_number), parseInt(seller_id));
        if (result) return res.json(result)
        return res.sendStatus(201)
    } catch (err: any) {
        return next(err);
    }
}

export const processChangeEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { changeSellerEmailToken } = req.body;
        if (!changeSellerEmailToken) return res.sendStatus(400);
        jwt.verify(changeSellerEmailToken, config.emailTokenSecret as any, async (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            const { seller_id } = decoded;
            await sellerModel.handleChangeEmail(seller_id);
            return res.sendStatus(200);
        });
    } catch (err: any) {
        return next(err);
    }
}

export const deactivateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        await sellerModel.handleDeactivateAccount(parseInt(seller_id));
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
};

export const getSellerStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        const result = await sellerModel.handleGetSellerStatus(parseInt(seller_id));
        return res.json({ status: result });
    } catch (err: any) {
        return next(err);
    }
};

export const activateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        await sellerModel.handleActivateAccount(parseInt(seller_id));
        return res.sendStatus(200);
    } catch (err: any) {
        return next(err);
    }
}

export const processViewVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seller_id } = req.params;
        const result = await sellerModel.handleViewVouchers(parseInt(seller_id));
        return res.json({ vouchers: result });
    } catch (err: any) {
        return next(err);
    }
}