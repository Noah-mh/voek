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
exports.activateAccount = exports.getSellerStatus = exports.deactivateAccount = exports.processChangeEmail = exports.processUpdateSellerDetails = exports.processGetSellerDetails = exports.processGetCustomerOrders = exports.processPackedAndShipped = exports.processGetSellerDelivered = exports.processGetSellerShipped = exports.processGetSellerOrders = exports.processResetPassword = exports.processForgetPasswordLink = exports.processForgetPassword = exports.processLogout = exports.processSignUpLink = exports.processSendEmailLink = exports.processVerifyOTP = exports.processSendEmailOTP = exports.processSendSMSOTP = exports.processLogin = exports.processGetOrderDetails = exports.processUpdateProductActive = exports.processUpdateProductVariationActive = exports.processAddProduct = exports.processGetAllCategories = exports.processGetAllProductsOfSeller = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const sellerModel = __importStar(require("../model/seller.model"));
// GET all products from 1 seller
const processGetAllProductsOfSeller = async (req, res, next) => {
    try {
        const sellerId = parseInt(req.params.sellerId);
        const response = await sellerModel.handleGetAllProducts(sellerId);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetAllProductsOfSeller = processGetAllProductsOfSeller;
// GET all categories
const processGetAllCategories = async (req, res, next) => {
    try {
        const response = await sellerModel.handleGetAllCategories();
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetAllCategories = processGetAllCategories;
// POST insert a new product
const processAddProduct = async (req, res, next) => {
    try {
        const sellerId = parseInt(req.params.sellerId);
        const { name, description, category_id, variation_1, variation_2, quantity, price } = req.body;
        if (!name || !category_id || !quantity || !price)
            return res.sendStatus(400);
        const response = await sellerModel.handleAddProduct(sellerId, name, description, category_id, variation_1, variation_2, quantity, price);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processAddProduct = processAddProduct;
// PUT product variation active
const processUpdateProductVariationActive = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);
        const { active, sku } = req.body;
        const response = await sellerModel.handleUpdateProductVariationActive(active, productId, sku);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processUpdateProductVariationActive = processUpdateProductVariationActive;
// PUT product active
const processUpdateProductActive = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);
        const { active } = req.body;
        const response = await sellerModel.handleUpdateProductActive(active, productId);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processUpdateProductActive = processUpdateProductActive;
// GET order details
const processGetOrderDetails = async (req, res, next) => {
    try {
        const ordersId = parseInt(req.params.ordersId);
        const response = await sellerModel.handleGetOrderDetails(ordersId);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetOrderDetails = processGetOrderDetails;
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
            res.cookie('sellerJwt', refreshToken, {
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
    if (!cookies?.sellerJwt)
        return res.sendStatus(204);
    const refreshToken = cookies.sellerJwt;
    await sellerModel.handleLogOut(refreshToken);
    res.clearCookie('sellerJwt', {
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
const processGetSellerOrders = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerOrders(seller_id);
        return res.json({ orders: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetSellerOrders = processGetSellerOrders;
const processGetSellerShipped = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerShipped(seller_id);
        return res.json({ shipped: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetSellerShipped = processGetSellerShipped;
const processGetSellerDelivered = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerDelivered(seller_id);
        return res.json({ delivered: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetSellerDelivered = processGetSellerDelivered;
const processPackedAndShipped = async (req, res, next) => {
    try {
        const { orders_product_id, customer_id } = req.body;
        if (!orders_product_id || !customer_id)
            return res.sendStatus(400);
        await sellerModel.handlePackedAndShipped(orders_product_id, customer_id);
        return res.sendStatus(201);
    }
    catch (err) {
        return next(err);
    }
};
exports.processPackedAndShipped = processPackedAndShipped;
const processGetCustomerOrders = async (req, res, next) => {
    try {
        const { seller_id, orders_id } = req.params;
        if (!seller_id || !orders_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleGetCustomerOrders(parseInt(seller_id), parseInt(orders_id));
        return res.json({ orders: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetCustomerOrders = processGetCustomerOrders;
const processGetSellerDetails = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        if (!seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleGetSellerDetails(parseInt(seller_id));
        return res.json({ sellerDetails: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetSellerDetails = processGetSellerDetails;
const processUpdateSellerDetails = async (req, res, next) => {
    try {
        const { password, email, shop_name, phone_number } = req.body;
        const { seller_id } = req.params;
        if (!seller_id)
            return res.sendStatus(400);
        const result = await sellerModel.handleUpdateSellerDetails(password, email, shop_name, parseInt(phone_number), parseInt(seller_id));
        if (result)
            return res.json(result);
        return res.sendStatus(201);
    }
    catch (err) {
        return next(err);
    }
};
exports.processUpdateSellerDetails = processUpdateSellerDetails;
const processChangeEmail = async (req, res, next) => {
    try {
        const { changeSellerEmailToken } = req.body;
        if (!changeSellerEmailToken)
            return res.sendStatus(400);
        jsonwebtoken_1.default.verify(changeSellerEmailToken, config_1.default.emailTokenSecret, async (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { seller_id } = decoded;
            await sellerModel.handleChangeEmail(seller_id);
            return res.sendStatus(200);
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processChangeEmail = processChangeEmail;
const deactivateAccount = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        await sellerModel.handleDeactivateAccount(parseInt(seller_id));
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.deactivateAccount = deactivateAccount;
const getSellerStatus = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        const result = await sellerModel.handleGetSellerStatus(parseInt(seller_id));
        return res.json({ status: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.getSellerStatus = getSellerStatus;
const activateAccount = async (req, res, next) => {
    try {
        const { seller_id } = req.params;
        await sellerModel.handleActivateAccount(parseInt(seller_id));
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.activateAccount = activateAccount;
//# sourceMappingURL=seller.controller.js.map