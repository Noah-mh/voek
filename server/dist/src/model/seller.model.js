"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = exports.handleSendEmailForgetPassword = exports.handleForgetPassword = exports.handleLogOut = exports.handleActiveAccount = exports.handleSignUp = exports.handleSendEmailLink = exports.handleVerifyOTP = exports.updateOTP = exports.handleSendEmailOTP = exports.handleSendSMSOTP = exports.handleStoreRefreshToken = exports.handleLogin = exports.handleGetAllProducts = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendInBlue_1 = __importDefault(require("../../config/sendInBlue"));
const teleSign_1 = __importDefault(require("../../config/teleSign"));
// GET all products from 1 seller
const handleGetAllProducts = async (sellerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.name, p.description, p.price, p.image_url FROM products p 
    RIGHT OUTER JOIN listed_products lp ON lp.product_id = p.product_id 
    WHERE lp.seller_id = ?;`;
    try {
        const result = await connection.query(sql, [sellerId]);
        return result[0];
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetAllProducts = handleGetAllProducts;
const handleLogin = async (email, password) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT password, seller_id, phone_number, shop_name, email FROM seller WHERE email = ?`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : '';
        const check = await bcrypt_1.default.compare(password, encryptrdPassword);
        if (check) {
            const seller_id = result[0][0]?.seller_id;
            const phone_number = result[0][0]?.phone_number;
            const email = result[0][0]?.email;
            const shopName = result[0][0]?.shop_name;
            return { seller_id, phone_number, email, shopName };
        }
        return null;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleLogin = handleLogin;
const handleStoreRefreshToken = async (refreshtoken, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token =? WHERE seller_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleStoreRefreshToken = handleStoreRefreshToken;
const handleSendSMSOTP = async (phoneNumber, seller_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const result = await (0, exports.updateOTP)(OTP, seller_id);
        const message = `Your OTP is ${OTP}`;
        const messageType = "ARN";
        teleSign_1.default.sms.message((err, res) => {
            if (err === null) {
                console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                    ` => code: ${res["status"]["code"]}` +
                    `, description: ${res["status"]["description"]}`);
            }
            else {
                console.log("Unable to send message. " + err);
                throw new Error(err);
            }
        }, `65${phoneNumber}`, message, messageType);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendSMSOTP = handleSendSMSOTP;
const handleSendEmailOTP = async (email, seller_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: 'voek.help.centre@gmail.com'
        };
        const receivers = [
            {
                email: email
            }
        ];
        const result = await (0, exports.updateOTP)(OTP, seller_id);
        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'OTP Verification For VOEK Seller Login',
            textContent: `Your OTP is ${OTP}`
        }).then((response) => {
            console.log(response);
            return result;
        }).catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailOTP = handleSendEmailOTP;
const updateOTP = async (OTP, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller_otp SET otp = ?, otp_creation = ? WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [OTP, convertLocalTimeToUTC(), seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.updateOTP = updateOTP;
const handleVerifyOTP = async (seller_id, OTP) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'SELECT * FROM seller_otp WHERE otp = ? and seller_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120';
    try {
        const result = await connection.query(sql, [OTP, seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleVerifyOTP = handleVerifyOTP;
const handleSendEmailLink = async (signUpToken, email) => {
    try {
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: "voek.help.centre@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        tranEmailApi
            .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Verification Link For VOEK Sign Up",
            textContent: `http://localhost:5173/seller/signup/verify?signupToken=${signUpToken}`,
        })
            .then((response) => {
            console.log(response);
            return;
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailLink = handleSendEmailLink;
const handleSignUp = async (shopName, password, email, phoneNumber) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET shop_name = ?, password = ?, phone_number = ?, date_created = NULL WHERE email = ? AND active = 0`;
    try {
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [shopName, encryptedPassword, phoneNumber, email]);
        if (result[0].affectedRows === 0) {
            const sql2 = `INSERT INTO seller (shop_name, password, email, phone_number, date_created) VALUES (?, ?, ?, ?, NULL)`;
            const result2 = await connection.query(sql2, [shopName, encryptedPassword, email, phoneNumber]);
            return result2[0].insertId;
        }
        else {
            const sql2 = `SELECT seller_id FROM seller WHERE email =  ?`;
            const result2 = await connection.query(sql2, [email]);
            return result2[0][0].seller_id;
        }
    }
    catch (err) {
        if (err.errno === 1062) {
            return 1062;
        }
        else {
            throw new Error(err);
        }
    }
    finally {
        await connection.release();
    }
};
exports.handleSignUp = handleSignUp;
const handleActiveAccount = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET active = 1 WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [seller_id]);
        const sql2 = `UPDATE seller SET date_created = utc_timestamp()`;
        const result2 = await connection.query(sql2, null);
        const sql3 = `INSERT INTO seller_otp (seller_id) VALUES (?)`;
        const result3 = await connection.query(sql3, [seller_id]);
        return result3[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleActiveAccount = handleActiveAccount;
const handleLogOut = async (refreshToken) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token = '' WHERE refresh_token = ?`;
    try {
        const result = await connection.query(sql, [refreshToken]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleLogOut = handleLogOut;
const handleForgetPassword = async (email) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT * FROM seller WHERE email = ? AND active = 1`;
    try {
        const result = await connection.query(sql, [email]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleForgetPassword = handleForgetPassword;
const handleSendEmailForgetPassword = async (forgetPasswordToken, email) => {
    try {
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: "voek.help.centre@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        tranEmailApi
            .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Verification Link For VOEK Sign Up",
            textContent: `http://localhost:5173/seller/forgetPassword/verify?forgetPasswordToken=${forgetPasswordToken}`,
        })
            .then((response) => {
            console.log(response);
            return;
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailForgetPassword = handleSendEmailForgetPassword;
const handleResetPassword = async (password, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET password = ? WHERE seller_id = ? AND active = 1`;
    try {
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [encryptedPassword, seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleResetPassword = handleResetPassword;
const convertLocalTimeToUTC = () => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = padZero(now.getUTCMonth() + 1);
    const utcDay = padZero(now.getUTCDate());
    const utcHours = padZero(now.getUTCHours());
    const utcMinutes = padZero(now.getUTCMinutes());
    const utcSeconds = padZero(now.getUTCSeconds());
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`;
};
const padZero = (value) => {
    return value.toString().padStart(2, '0');
};
//# sourceMappingURL=seller.model.js.map