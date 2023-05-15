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
exports.processResetPassword = exports.processForgetPasswordLink = exports.processForgetPassword = exports.processLogout = exports.updateCustLastViewedCat = exports.processSignUpLink = exports.processSendEmailLink = exports.processVerifyOTP = exports.processSendEmailOTP = exports.processSendSMSOTP = exports.processLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const customerModel = __importStar(require("../model/customer.model"));
const processLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400);
    }
    else {
        try {
            const response = await customerModel.handleLogin(email, password);
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
        const { phoneNumber, customer_id } = req.body;
        if (!phoneNumber || !customer_id)
            return res.sendStatus(400);
        const response = await customerModel.handleSendSMSOTP(phoneNumber, customer_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processSendSMSOTP = processSendSMSOTP;
const processSendEmailOTP = async (req, res, next) => {
    try {
        const { email, customer_id } = req.body;
        if (!email || !customer_id)
            return res.sendStatus(400);
        const response = await customerModel.handleSendEmailOTP(email, customer_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processSendEmailOTP = processSendEmailOTP;
const processVerifyOTP = async (req, res, next) => {
    try {
        const { customer_id, OTP } = req.body;
        if (!customer_id || !OTP)
            return res.sendStatus(400);
        const response = await customerModel.handleVerifyOTP(customer_id, OTP);
        if (response.length) {
            const accessToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    customer_id: response[0].customer_id,
                    role: "customer"
                }
            }, config_1.default.accessTokenSecret, { expiresIn: '60s' });
            const refreshToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    customer_id: response[0].customer_id,
                    role: "customer"
                }
            }, config_1.default.refreshTokenSecret, { expiresIn: '3600s' });
            await customerModel.handleStoreRefreshToken(refreshToken, response[0].customer_id);
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
        const { email, username, phone_number, password } = req.body;
        if (!email || !username || !phone_number || !password)
            return res.sendStatus(400);
        const result = await customerModel.handleSignUp(username, password, email, phone_number);
        if (result === 1062) {
            return res.sendStatus(409);
        }
        console.log(result);
        const signUpToken = jsonwebtoken_1.default.sign({ customer_id: result }, config_1.default.signUpCustomerTokenSecret, { expiresIn: '300s' });
        const result2 = await customerModel.handleSendEmailLink(signUpToken, email);
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
        jsonwebtoken_1.default.verify(signUpToken, config_1.default.signUpCustomerTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { customer_id } = decoded;
            const result = customerModel.handleActiveAccount(customer_id);
            return res.status(200);
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processSignUpLink = processSignUpLink;
const updateCustLastViewedCat = async (req, res, next) => {
    try {
        const { cat_id, customer_id } = req.body;
        try {
            const response = await customerModel.handlesCustLastViewdCat(cat_id, customer_id);
            console.log(response);
            if (response === 0)
                return res.sendStatus(404);
            return res.sendStatus(200);
        }
        catch (err) {
            return next(err);
        }
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateCustLastViewedCat = updateCustLastViewedCat;
const processLogout = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    await customerModel.handleLogOut(refreshToken);
    res.clearCookie('jwt', {
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);
};
exports.processLogout = processLogout;
const processForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.sendStatus(400);
        const result = await customerModel.handleForgetPassword(email);
        if (result) {
            const forgetPasswordToken = jsonwebtoken_1.default.sign({ customer_id: result[0].customer_id }, config_1.default.forgetPasswordCustomerTokenSecret, { expiresIn: '300s' });
            await customerModel.handleSendEmailForgetPassword(forgetPasswordToken, email);
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
        jsonwebtoken_1.default.verify(forgetPasswordToken, config_1.default.forgetPasswordCustomerTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { customer_id } = decoded;
            return res.json({ customer_id });
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processForgetPasswordLink = processForgetPasswordLink;
const processResetPassword = async (req, res, next) => {
    try {
        const { password, customer_id } = req.body;
        console.log(password, customer_id);
        if (!password || !customer_id)
            return res.sendStatus(400);
        const result = await customerModel.handleResetPassword(password, customer_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processResetPassword = processResetPassword;
//# sourceMappingURL=customer.controller.js.map