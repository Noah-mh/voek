"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processResetPassword = exports.processForgetPasswordLink = exports.processForgetPassword = exports.processLogout = exports.processSignUpLink = exports.processSendEmailLink = exports.processVerifyOTP = exports.processSendEmailOTP = exports.processSendSMSOTP = exports.processLogin = exports.processGetAllProductsOfSeller = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const sellerModel = __importStar(require("../model/seller.model"));
// GET all products from 1 seller
const processGetAllProductsOfSeller = async (req, res, next) => {
    try {
        console.log("yes");
        const sellerId = parseInt(req.params.sellerId);
        const response = await sellerModel.handleGetAllProducts(sellerId);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetAllProductsOfSeller = processGetAllProductsOfSeller;
const processLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    }
    else {
        try {
            const response = await sellerModel.handleLogin(email, password);
            if (response) {
                return res.json(response);
            }
            else {
                res.sendStatus(401);
            }
        }
        catch (err) {
            return next(err);
        }
    }
};
exports.processLogin = processLogin;
const processSendSMSOTP = async (req, res, next) => {
    try {
        const { phoneNumber, seller_id } = req.body;
        if (!phoneNumber || !seller_id)
            return res.sendStatus(400);
        const response = await sellerModel.handleSendSMSOTP(phoneNumber, seller_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processSendSMSOTP = processSendSMSOTP;
const processSendEmailOTP = async (req, res, next) => {
    try {
        const { email, seller_id } = req.body;
        if (!email || !seller_id)
            return res.sendStatus(400);
        const response = await sellerModel.handleSendEmailOTP(email, seller_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processSendEmailOTP = processSendEmailOTP;
const processVerifyOTP = async (req, res, next) => {
    try {
        const { seller_id, OTP } = req.body;
        if (!seller_id || !OTP)
            return res.sendStatus(400);
        const response = await sellerModel.handleVerifyOTP(seller_id, OTP);
        if (response.length) {
            const accessToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    seller_id: response[0].seller_id,
                    role: "seller"
                }
            }, config_1.default.accessTokenSecret, { expiresIn: '300s' });
            const refreshToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    seller_id: response[0].seller_id,
                    role: "seller"
                }
            }, config_1.default.refreshTokenSecret, { expiresIn: '1d' });
            await sellerModel.handleStoreRefreshToken(refreshToken, response[0].seller_id);
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({ refreshToken, accessToken });
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (err) {
        return next(err);
    }
};
exports.processVerifyOTP = processVerifyOTP;
const processSendEmailLink = async (req, res, next) => {
    try {
        const { email, shopName, phone_number, password } = req.body;
        if (!email || !shopName || !phone_number || !password)
            return res.sendStatus(400);
        const result = await sellerModel.handleSignUp(shopName, password, email, phone_number);
        if (result === 1062) {
            return res.sendStatus(409);
        }
        const signUpToken = jsonwebtoken_1.default.sign({
            seller_id: result
        }, config_1.default.signUpSellerTokenSecret, { expiresIn: '300s' });
        const resul2 = await sellerModel.handleSendEmailLink(signUpToken, email);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processSendEmailLink = processSendEmailLink;
const processSignUpLink = async (req, res, next) => {
    try {
        const { signUpToken } = req.body;
        if (!signUpToken)
            return res.sendStatus(400);
        jsonwebtoken_1.default.verify(signUpToken, config_1.default.signUpSellerTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { seller_id } = decoded;
            const result = sellerModel.handleActiveAccount(seller_id);
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processSignUpLink = processSignUpLink;
const processLogout = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    await sellerModel.handleLogOut(refreshToken);
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    res.sendStatus(204);
};
exports.processLogout = processLogout;
const processForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.sendStatus(400);
        const result = await sellerModel.handleForgetPassword(email);
        if (result.length) {
            const forgetPaasswordToken = jsonwebtoken_1.default.sign({ seller_id: result[0].seller_id }, config_1.default.forgetPasswordSellerTokenSecret, { expiresIn: '300s' });
            await sellerModel.handleSendEmailForgetPassword(forgetPaasswordToken, email);
        }
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processForgetPassword = processForgetPassword;
const processForgetPasswordLink = async (req, res, next) => {
    try {
        const { forgetPasswordToken } = req.body;
        if (!forgetPasswordToken)
            return res.sendStatus(400);
        jsonwebtoken_1.default.verify(forgetPasswordToken, config_1.default.forgetPasswordSellerTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { seller_id } = decoded;
            return res.json({ seller_id });
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processForgetPasswordLink = processForgetPasswordLink;
const processResetPassword = async (req, res, next) => {
    try {
        const { password, seller_id } = req.body;
        if (!password || !seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleResetPassword(password, seller_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processResetPassword = processResetPassword;
//# sourceMappingURL=seller.controller.js.map