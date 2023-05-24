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
exports.processCustomerAddressUpdate = exports.processCustomerAddressDelete = exports.processCustomerAddressAdd = exports.activateAccount = exports.getCustomerStatus = exports.deactivateAccount = exports.updateCustomerPhoto = exports.processChangeEmail = exports.updateCustomerDetails = exports.getCustomerDetails = exports.getCustomerLastViewedCat = exports.updateCustomerLastViewedCat = exports.processGetAddress = exports.processGetCoins = exports.processGetReferralId = exports.processResetPassword = exports.processForgetPasswordLink = exports.processForgetPassword = exports.processLogout = exports.processSignUpLink = exports.processSendEmailLink = exports.processVerifyOTP = exports.processSendEmailOTP = exports.processSendSMSOTP = exports.processLogin = void 0;
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
                    role: "customer",
                },
            }, config_1.default.accessTokenSecret, { expiresIn: "300s" });
            const refreshToken = jsonwebtoken_1.default.sign({
                UserInfo: {
                    customer_id: response[0].customer_id,
                    role: "customer",
                },
            }, config_1.default.refreshTokenSecret, { expiresIn: "1d" });
            await customerModel.handleStoreRefreshToken(refreshToken, response[0].customer_id);
            res.cookie("customerJwt", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
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
        const { referral_id } = req.params;
        if (!email || !username || !phone_number || !password)
            return res.sendStatus(400);
        const result = await customerModel.handleSignUp(username, password, email, phone_number, referral_id);
        if (result === 1062) {
            return res.sendStatus(409);
        }
        const signUpToken = jsonwebtoken_1.default.sign({ customer_id: result, referral_id }, config_1.default.signUpCustomerTokenSecret, { expiresIn: "300s" });
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
            const { customer_id, referral_id } = decoded;
            const result = customerModel.handleActiveAccount(customer_id, referral_id);
            return res.status(200);
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processSignUpLink = processSignUpLink;
const processLogout = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.customerJwt)
        return res.sendStatus(204);
    const refreshToken = cookies.customerJwt;
    await customerModel.handleLogOut(refreshToken);
    res.clearCookie("customerJwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
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
        if (result.length) {
            const forgetPasswordToken = jsonwebtoken_1.default.sign({ customer_id: result[0].customer_id }, config_1.default.forgetPasswordCustomerTokenSecret, { expiresIn: "300s" });
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
const processGetReferralId = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id)
            return res.sendStatus(400);
        const result = await customerModel.handleGetReferralId(customer_id);
        return res.json({ referral_id: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetReferralId = processGetReferralId;
//ALLISON :D
const processGetCoins = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const result = await customerModel.handleGetCoins(customer_id);
        console.log("Successfully got coins");
        return res.json({ result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetCoins = processGetCoins;
const processGetAddress = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const result = await customerModel.handleGetCustomerAddresses(customer_id);
        console.log("Successfully got address");
        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetAddress = processGetAddress;
// NHAT TIEN :D
const updateCustomerLastViewedCat = async (req, res, next) => {
    try {
        const { categoryId, customerId } = req.body;
        const response = await customerModel.handlesUpdateCustomerLastViewedCat(categoryId, customerId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateCustomerLastViewedCat = updateCustomerLastViewedCat;
const getCustomerLastViewedCat = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const customerId = parseInt(customer_id);
        const response = await customerModel.handlesGetCustomerLastViewedCat(customerId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getCustomerLastViewedCat = getCustomerLastViewedCat;
//Noah
const getCustomerDetails = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        // Type checking for customer_id.
        const response = await customerModel.handlesCustomerDetails(parseInt(customer_id));
        // Respond with status code and the data.
        return res.json({ details: response });
    }
    catch (err) {
        // Return a response with status code and error message.
        return res.status(500).json({ message: err.message });
    }
};
exports.getCustomerDetails = getCustomerDetails;
// export const updateCustomerDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { customer_id } = req.params;
//     const { username, email, phone_number } = req.body;
//     const customerId = parseInt(customer_id);
//     const response: number =
//       await customerModel.handleCustomerProfileEdit(
//         username,
//         email,
//         phone_number,
//         customerId
//       );
//     if (!response) return res.sendStatus(404);
//     return res.sendStatus(200);
//   } catch (err: any) {
//     return next(err);
//   }
// };
//Noah
const updateCustomerDetails = async (req, res, next) => {
    try {
        const { password, email, username, phone_number } = req.body;
        const { customer_id } = req.params;
        if (!customer_id)
            return res.sendStatus(400);
        const result = await customerModel.handleUpdateCustomerDetails(password, email, username, parseInt(phone_number), parseInt(customer_id));
        if (result)
            return res.json(result);
        return res.sendStatus(201);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateCustomerDetails = updateCustomerDetails;
const processChangeEmail = async (req, res, next) => {
    try {
        const { changeCustomerEmailToken } = req.body;
        if (!changeCustomerEmailToken)
            return res.sendStatus(400);
        jsonwebtoken_1.default.verify(changeCustomerEmailToken, config_1.default.emailTokenSecret, async (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            const { customer_id } = decoded;
            await customerModel.handleChangeEmail(customer_id);
            return res.sendStatus(200);
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.processChangeEmail = processChangeEmail;
//Noah
const updateCustomerPhoto = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const { image_url } = req.body;
        const customerId = parseInt(customer_id);
        const response = await customerModel.handleCustomerProfilePhotoEdit(image_url, customerId);
        if (!response)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateCustomerPhoto = updateCustomerPhoto;
const deactivateAccount = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        await customerModel.handleDeactivateAccount(parseInt(customer_id));
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.deactivateAccount = deactivateAccount;
const getCustomerStatus = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const result = await customerModel.handleGetCustomerStatus(parseInt(customer_id));
        return res.json({ status: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.getCustomerStatus = getCustomerStatus;
const activateAccount = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        await customerModel.handleActivateAccount(parseInt(customer_id));
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.activateAccount = activateAccount;
// export const processUpdateCustomerDetails = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { password, email, shop_name, phone_number } = req.body;
//     const { customer_id } = req.params;
//     if (!customer_id) return res.sendStatus(400);
//     const result = await customerModel.handleUpdateCustomerDetails(password, email, shop_name, parseInt(phone_number), parseInt(customer_id));
//     if (result) return res.json(result)
//     return res.sendStatus(201)
//   } catch (err: any) {
//     return next(err);
//   }
// }
//Noah
const processCustomerAddressAdd = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const { postal_code, block, street_name, country, unit_no } = req.body;
        const customerId = parseInt(customer_id);
        const response = await customerModel.handleCustomerAddressAdd(postal_code, block, street_name, country, unit_no, customerId);
        if (!response)
            return res.sendStatus(404);
        console.log("Successfully added address with id ", response);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processCustomerAddressAdd = processCustomerAddressAdd;
//Noah
const processCustomerAddressDelete = async (req, res, next) => {
    try {
        const { customer_id, address_id } = req.params;
        const customerId = parseInt(customer_id);
        const addressId = parseInt(address_id);
        const response = await customerModel.handleCustomerAddressDelete(addressId, customerId);
        if (!response)
            return res.sendStatus(404);
        console.log("Successfully deleted address");
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processCustomerAddressDelete = processCustomerAddressDelete;
//Noah
const processCustomerAddressUpdate = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const { address_id, postal_code, block, street_name, country, unit_no, } = req.body;
        const customerId = parseInt(customer_id);
        const addressId = parseInt(address_id);
        const response = await customerModel.handleCustomerAddressUpdate(addressId, postal_code, block, street_name, country, unit_no, customerId);
        if (!response)
            return res.sendStatus(404);
        console.log("Successfully updated address");
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processCustomerAddressUpdate = processCustomerAddressUpdate;
//# sourceMappingURL=customer.controller.js.map