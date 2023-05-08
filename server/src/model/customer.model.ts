import pool from '../../config/database';
import bycrpt from 'bcrypt';
import config from '../../config/config';


var TeleSignSDK = require('telesignsdk');
const rest_endpoint = "https://rest-api.telesign.com";
const timeout = 10 * 1000; // 10 secs
const client = new TeleSignSDK(config.telesignCustomerId,
    config.telesignAPIKey,
    rest_endpoint,
    timeout
);

export const handleLogin = async (email: string, password: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT username, password, customer_id, phone_number, email FROM customer WHERE email = ?`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : '';
        const check = await bycrpt.compare(password, encryptrdPassword);
        if (check) {
            const customer_id: number = result[0][0]?.customer_id;
            const username: string = result[0][0]?.username;
            const phone_number: number = result[0][0]?.phone_number;
            const email: string = result[0][0]?.email;
            return { customer_id, username, phone_number, email };
        }
        return null;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleStoreRefreshToken = async (refreshtoken: string, customer_id: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET refresh_token =? WHERE customer_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, customer_id]);
        return result[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleSendSMSOTP = async (phoneNumber: number, customer_id: number) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const result = await updateOTP(OTP, customer_id);
        const message = `Your OTP is ${OTP}`;
        const messageType = "ARN";
        client.sms.message((err: any, res: any) => {
            if (err === null) {
                console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                    ` => code: ${res["status"]["code"]}` +
                    `, description: ${res["status"]["description"]}`);
            } else {
                console.log("Unable to send message. " + err);
                throw new Error(err);
            }
        }, `65${phoneNumber}`, message, messageType);
        return result[0];
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateOTP = async (OTP: number, customer_id: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer_otp SET otp = ?, otp_creation = ? WHERE customer_id = ?`;
    try {
        const result = await connection.query(sql, [OTP, convertLocalTimeToUTC(), customer_id]);
        return result[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}







const convertLocalTimeToUTC = (): string => {
    const now = new Date();
  
    const utcYear = now.getUTCFullYear();
    const utcMonth = padZero(now.getUTCMonth() + 1);
    const utcDay = padZero(now.getUTCDate());
    const utcHours = padZero(now.getUTCHours());
    const utcMinutes = padZero(now.getUTCMinutes());
    const utcSeconds = padZero(now.getUTCSeconds());
  
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`;
  }

const padZero = (value: number): string => {
    return value.toString().padStart(2, '0');
}
