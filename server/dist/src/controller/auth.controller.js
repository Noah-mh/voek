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
exports.processRefreshSeller = exports.processRefreshTokenCustomer = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel = __importStar(require("../model/auth.model"));
const config_1 = __importDefault(require("../../config/config"));
const processRefreshTokenCustomer = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const result = await authModel.handleRefreshTokenCustomer(refreshToken);
        if (!result.length)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(refreshToken, config_1.default.refreshTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(401);
            const accessToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    customer_id: result[0].customer_id,
                    role: "customer"
                }
            }, config_1.default.accessTokenSecret, { expiresIn: '300s' });
            return res.json({ accessToken, customer_id: result[0].customer_id, username: result[0].username });
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processRefreshTokenCustomer = processRefreshTokenCustomer;
const processRefreshSeller = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const result = await authModel.handleRefreshTokenSeller(refreshToken);
        if (!result.length)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(refreshToken, config_1.default.refreshTokenSecret, (err, decoded) => {
            if (err)
                return res.sendStatus(401);
            const accessToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    customer_id: result[0].seller_id,
                    role: "seller"
                }
            }, config_1.default.accessTokenSecret, { expiresIn: '300s' });
            return res.json({ accessToken, seller_id: result[0].seller_id, shop_name: result[0].shop_name });
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processRefreshSeller = processRefreshSeller;
//# sourceMappingURL=auth.controller.js.map