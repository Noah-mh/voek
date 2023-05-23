"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomerProfilePhotoEdit = exports.handleCustomerProfileEdit = exports.handlesCustomerDetails = exports.handlesGetCustomerLastViewedCat = exports.handlesUpdateCustomerLastViewedCat = exports.handleGetCustomerAddresses = exports.handleGetCoins = exports.handleActivateAccount = exports.handleGetCustomerStatus = exports.handleDeactivateAccount = exports.handleChangeEmail = exports.handleSendEmailChange = exports.handleUpdateCustomerDetails = exports.handleGetReferralId = exports.handleResetPassword = exports.handleSendEmailForgetPassword = exports.handleForgetPassword = exports.handleLogOut = exports.handleActiveAccount = exports.handleGetCustomerIdByRefId = exports.handleSignUp = exports.handleSendEmailLink = exports.handleVerifyOTP = exports.updateOTP = exports.handleSendEmailOTP = exports.handleSendSMSOTP = exports.handleStoreRefreshToken = exports.handleLogin = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendInBlue_1 = __importDefault(require("../../config/sendInBlue"));
const teleSign_1 = __importDefault(require("../../config/teleSign"));
const config_1 = __importDefault(require("../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleLogin = async (email, password) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT username, password, customer_id, phone_number, email FROM customer WHERE email = ? AND active != 0`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : "";
        const check = await bcrypt_1.default.compare(password, encryptrdPassword);
        if (check) {
            const customer_id = result[0][0]?.customer_id;
            const username = result[0][0]?.username;
            const phone_number = result[0][0]?.phone_number;
            const email = result[0][0]?.email;
            return { customer_id, username, phone_number, email };
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
const handleStoreRefreshToken = async (refreshtoken, customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET refresh_token =? WHERE customer_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, customer_id]);
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
const handleSendSMSOTP = async (phoneNumber, customer_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const result = await (0, exports.updateOTP)(OTP, customer_id);
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
const handleSendEmailOTP = async (email, customer_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: "voek.help.centre@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        const result = await (0, exports.updateOTP)(OTP, customer_id);
        tranEmailApi
            .sendTransacEmail({
            sender,
            to: receivers,
            subject: "OTP Verification For VOEK Login",
            textContent: `Your OTP is ${OTP}`,
        })
            .then((response) => {
            console.log(response);
            return result;
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailOTP = handleSendEmailOTP;
const updateOTP = async (OTP, customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer_otp SET otp = ?, otp_creation = ? WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [
            OTP,
            convertLocalTimeToUTC(),
            customer_id,
        ]);
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
const handleVerifyOTP = async (customer_id, OTP) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = "SELECT * FROM customer_otp WHERE otp = ? and customer_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120";
    try {
        const result = await connection.query(sql, [OTP, customer_id]);
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
            textContent: `http://localhost:5173/signup/verify?signupToken=${signUpToken}`,
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
const handleSignUp = async (username, password, email, phoneNumber, referral_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET username = ?, password = ?, phone_number = ?, referred_by = ?, date_created = NULL WHERE email = ? AND active = 0`;
    try {
        const customer_id = referral_id != "null"
            ? await (0, exports.handleGetCustomerIdByRefId)(referral_id)
            : null;
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [
            username,
            encryptedPassword,
            phoneNumber,
            customer_id,
            email,
        ]);
        if (result[0].affectedRows === 0) {
            const sql2 = `INSERT INTO customer (username, password, email, phone_number, date_created, referred_by) VALUES (?, ?, ?, ?, NULL, ?)`;
            const result2 = await connection.query(sql2, [
                username,
                encryptedPassword,
                email,
                phoneNumber,
                customer_id,
            ]);
            return result2[0].insertId;
        }
        else {
            const sql2 = `SELECT customer_id FROM customer WHERE email =  ?`;
            const result2 = await connection.query(sql2, [email]);
            return result2[0][0].customer_id;
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
const handleGetCustomerIdByRefId = async (referral_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT customer_id FROM customer WHERE referral_id = ?`;
    try {
        const result = await connection.query(sql, [referral_id]);
        return result[0][0]?.customer_id ? result[0][0].customer_id : null;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerIdByRefId = handleGetCustomerIdByRefId;
const handleActiveAccount = async (customer_id, referral_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET active = 1, referral_id = UUID() WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [customer_id]);
        const sql2 = `UPDATE customer SET date_created = utc_timestamp()`;
        const result2 = await connection.query(sql2, null);
        const sql3 = `INSERT INTO customer_otp (customer_id) VALUES (?)`;
        const result3 = await connection.query(sql3, [customer_id]);
        if (referral_id) {
            const sql4 = `UPDATE customer SET coins = coins + 5 WHERE referral_id = ?`;
            await connection.query(sql4, [referral_id]);
        }
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
    const sql = `UPDATE customer SET refresh_token = NULL WHERE refresh_token = ?`;
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
    const sql = `SELECT * FROM customer WHERE email = ? AND active = 1`;
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
            textContent: `http://localhost:5173/forgetPassword/verify?forgetPasswordToken=${forgetPasswordToken}`,
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
const handleResetPassword = async (password, customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET password = ? WHERE customer_id = ? AND active = 1`;
    try {
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [
            encryptedPassword,
            customer_id,
        ]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleResetPassword = handleResetPassword;
const handleGetReferralId = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT referral_id FROM customer WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0][0].referral_id;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetReferralId = handleGetReferralId;
const handleUpdateCustomerDetails = async (password, email, username, phone_number, customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    try {
        let sql = `SELECT * FROM customer WHERE email like ? and customer_id != ?`;
        let result = await connection.query(sql, [email, customer_id]);
        if (result[0].length != 0) {
            return { duplicateEmail: true };
        }
        else {
            let sql = `SELECT * FROM customer WHERE email like ? and customer_id = ?`;
            let result = await connection.query(sql, [email, customer_id]);
            if (result[0].length === 0) {
                sql = 'UPDATE update_customer SET new_email = ?, email_sent = utc_timestamp() WHERE customer_id = ?';
                result = await connection.query(sql, [email, customer_id]);
                if (result[0].affectedRows === 0) {
                    sql = 'INSERT INTO update_customer (customer_id, new_email, email_sent) VALUES (?, ?, utc_timestamp())';
                    result = await connection.query(sql, [customer_id, email]);
                }
                await (0, exports.handleSendEmailChange)(customer_id, email);
                if (password) {
                    const encryptedPassword = await bcrypt_1.default.hash(password, 10);
                    sql = `UPDATE customer SET password = ?, username = ?, phone_number = ? WHERE customer_id = ?`;
                    result = await connection.query(sql, [encryptedPassword, username, phone_number, customer_id]);
                }
                else {
                    sql = 'UPDATE customer SET username = ?, phone_number = ? WHERE customer_id = ?';
                    result = await connection.query(sql, [username, phone_number, customer_id]);
                }
                return { emailChange: true };
            }
            else {
                if (password) {
                    const encryptedPassword = await bcrypt_1.default.hash(password, 10);
                    sql = `UPDATE customer SET password = ?, username = ?, phone_number = ? WHERE customer_id = ?`;
                    result = await connection.query(sql, [encryptedPassword, username, phone_number, customer_id]);
                }
                else {
                    sql = 'UPDATE customer SET username = ?, phone_number = ? WHERE customer_id = ?';
                    result = await connection.query(sql, [username, phone_number, customer_id]);
                }
            }
        }
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleUpdateCustomerDetails = handleUpdateCustomerDetails;
const handleSendEmailChange = async (customer_id, email) => {
    const changeCustomerEmailToken = jsonwebtoken_1.default.sign({
        customer_id: customer_id,
    }, config_1.default.emailTokenSecret, { expiresIn: '300s' });
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
        subject: "Verification Link For VOEK Email Change",
        textContent: `http://localhost:5173/customer/email-verification?token=${changeCustomerEmailToken}`,
    })
        .then((response) => {
        console.log(response);
        return;
    })
        .catch((err) => {
        throw new Error(err);
    });
};
exports.handleSendEmailChange = handleSendEmailChange;
const handleChangeEmail = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    try {
        let sql = `SELECT new_email FROM update_customer WHERE customer_id = ?`;
        let result = await connection.query(sql, [customer_id]);
        const email = result[0][0].new_email;
        sql = `UPDATE customer SET email = ? WHERE customer_id = ?`;
        result = await connection.query(sql, [email, customer_id]);
        sql = `DELETE FROM update_customer WHERE customer_id = ?`;
        result = await connection.query(sql, [customer_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleChangeEmail = handleChangeEmail;
const handleDeactivateAccount = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'UPDATE customer SET active = 0 WHERE customer_id = ?';
    try {
        const result = await connection.query(sql, [customer_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleDeactivateAccount = handleDeactivateAccount;
const handleGetCustomerStatus = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'SELECT active FROM customer WHERE customer_id = ?';
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0][0].active;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerStatus = handleGetCustomerStatus;
const handleActivateAccount = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'UPDATE customer SET active = 1 WHERE customer_id = ?';
    try {
        const result = await connection.query(sql, [customer_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleActivateAccount = handleActivateAccount;
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
    return value.toString().padStart(2, "0");
};
//ALLISON :D
const handleGetCoins = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT coins FROM customer WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0][0].coins;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCoins = handleGetCoins;
const handleGetCustomerAddresses = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT address_id, postal_code, block, street_name, country, unit_no FROM customer_address WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerAddresses = handleGetCustomerAddresses;
// NHAT TIEN :D
const handlesUpdateCustomerLastViewedCat = async (categoryId, customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET last_viewed_cat_id = ? WHERE customer_id = ?;`;
    try {
        const result = await connection.query(sql, [categoryId, customerId]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesUpdateCustomerLastViewedCat = handlesUpdateCustomerLastViewedCat;
const handlesGetCustomerLastViewedCat = async (customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT last_viewed_cat_id as categoryId FROM customer WHERE customer_id = ?;`;
    try {
        const result = await connection.query(sql, [customerId]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetCustomerLastViewedCat = handlesGetCustomerLastViewedCat;
//Noah
const handlesCustomerDetails = async (customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT 
  customer.*, 
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'address_id', customer_address.address_id,
      'postal_code', customer_address.postal_code,
      'block', customer_address.block,
      'street_name', customer_address.street_name,
      'country', customer_address.country,
      'unit_no', customer_address.unit_no
    )
  ) AS addresses
FROM 
  customer
LEFT JOIN 
  customer_address ON customer.customer_id = customer_address.customer_id
WHERE 
  customer.customer_id = ?
GROUP BY 
  customer.customer_id;
`;
    try {
        const [result] = await connection.query(sql, [customerId]);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesCustomerDetails = handlesCustomerDetails;
const handleCustomerProfileEdit = async (username, email, phoneNumber, customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    UPDATE customer
    SET
      username = ?,
      email = ?,
      phone_number = ?
    WHERE customer_id = ?
  `;
    try {
        const [result] = await connection.query(sql, [
            username,
            email,
            phoneNumber,
            customerId,
        ]);
        return result.affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleCustomerProfileEdit = handleCustomerProfileEdit;
const handleCustomerProfilePhotoEdit = async (image_url, customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    UPDATE customer
    SET
      image_url = ?
    WHERE customer_id = ?
  `;
    try {
        const [result] = await connection.query(sql, [
            image_url,
            customerId,
        ]);
        return result.affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleCustomerProfilePhotoEdit = handleCustomerProfilePhotoEdit;
//# sourceMappingURL=customer.model.js.map