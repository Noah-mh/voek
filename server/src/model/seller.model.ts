import pool from '../../config/database';
import bcrypt from 'bcrypt';
import Sib from '../../config/sendInBlue';
import client from '../../config/teleSign';

// GET all products from 1 seller
export const handleGetAllProducts = async (sellerId: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = 
    `SELECT p.name, p.description, p.price, p.image_url FROM products p 
    RIGHT OUTER JOIN listed_products lp ON lp.product_id = p.product_id 
    WHERE lp.seller_id = ?;`
    try {
        const result = await connection.query(sql, [sellerId]);
        return result[0];
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    } finally {
        await connection.release();
    }
}


export const handleLogin = async (email: string, password: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT password, seller_id, phone_number, shop_name email FROM seller WHERE email = ?`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : '';
        const check = await bcrypt.compare(password, encryptrdPassword);
        if (check) {
            const seller_id: number = result[0][0]?.seller_id;
            const phone_number: number = result[0][0]?.phone_number;
            const email: string = result[0][0]?.email;
            const shopName: string = result[0][0]?.shop_name;
            return { seller_id, phone_number, email, shopName  };
        }
        return null;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleStoreRefreshToken = async (refreshtoken: string, seller_id: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token =? WHERE seller_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, seller_id]);
        return result[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleSendSMSOTP = async (phoneNumber: number, seller_id: number) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const result = await updateOTP(OTP, seller_id);
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

export const handleSendEmailOTP = async (email: string, seller_id: number) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'voek.help.centre@gmail.com'
        }

        const receivers = [
            {
                email: email
            }
        ]

        const result = await updateOTP(OTP, seller_id);

        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'OTP Verification For VOEK Seller Login',
            textContent: `Your OTP is ${OTP}`
        }).then((response: any) => {
            console.log(response);
            return result[0];
        }).catch((err: any) => {
            throw new Error(err);
        })
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateOTP = async (OTP: number, seller_id: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller_otp SET otp = ?, otp_creation = ? WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [OTP, convertLocalTimeToUTC(), seller_id]);
        return result[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleVerifyOTP = async (seller_id: number, OTP: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = 'SELECT * FROM seller_otp WHERE otp = ? and seller_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120';
    try {
        const result = await connection.query(sql, [OTP, seller_id]);
        return result[0];
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleSendEmailLink = async (signUpToken: string, email: string) => {
    try {
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'voek.help.centre@gmail.com'
        }

        const receivers = [
            {
                email: email
            }
        ]

        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Verification Link For VOEK Seller Sign Up',
            textContent: `http://localhost:5173/signUp/${signUpToken}`
        }).then((response: any) => {
            console.log(response);
            return;
        }).catch((err: any) => {
            throw new Error(err);
        })
    } catch (err: any) {
        throw new Error(err);
    }
}

export const handleSignUp = async (shopName: string, password: string, email: string, phoneNumber: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO seller (shop_name, password, email, phone_number) VALUES (?, ?, ?, ?)`;
    try {
        const encryptedPassword = await bcrypt.hash(password, 10)
        const result = await connection.query(sql, [shopName, encryptedPassword, email, phoneNumber]);
        const sql2 = `INSERT INTO seller_otp (seller_id) VALUES(?)`;
        const result2 = await connection.query(sql2, [result[0].insertId]);
        return result2[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleLogOut = async (refreshToken: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token = '' WHERE refresh_token = ?`;
    try {
        const result = await connection.query(sql, [refreshToken]);
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
