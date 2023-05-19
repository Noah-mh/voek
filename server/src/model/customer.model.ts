import pool from "../../config/database";
import bcrypt from "bcrypt";
import Sib from "../../config/sendInBlue";
import client from "../../config/teleSign";
import { connect } from "http2";

export const handleLogin = async (
  email: string,
  password: string
): Promise<LoginResult | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT username, password, customer_id, phone_number, email FROM customer WHERE email = ? AND active != 0`;
  try {
    const result: any = await connection.query(sql, [email]);
    const encryptrdPassword = result[0].length ? result[0][0].password : "";
    const check = await bcrypt.compare(password, encryptrdPassword);
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
};

export const handleStoreRefreshToken = async (
  refreshtoken: string,
  customer_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET refresh_token =? WHERE customer_id =?`;
  try {
    const result = await connection.query(sql, [refreshtoken, customer_id]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSendSMSOTP = async (
  phoneNumber: number,
  customer_id: number
): Promise<number> => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const result = await updateOTP(OTP, customer_id);
    const message = `Your OTP is ${OTP}`;
    const messageType = "ARN";
    client.sms.message(
      (err: any, res: any) => {
        if (err === null) {
          console.log(
            `Messaging response for messaging phone number: ${phoneNumber}` +
              ` => code: ${res["status"]["code"]}` +
              `, description: ${res["status"]["description"]}`
          );
        } else {
          console.log("Unable to send message. " + err);
          throw new Error(err);
        }
      },
      `65${phoneNumber}`,
      message,
      messageType
    );
    return result as number;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const handleSendEmailOTP = async (
  email: string,
  customer_id: number
): Promise<any> => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "voek.help.centre@gmail.com",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const result = await updateOTP(OTP, customer_id);

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "OTP Verification For VOEK Login",
        textContent: `Your OTP is ${OTP}`,
      })
      .then((response: any) => {
        console.log(response);
        return result as number;
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateOTP = async (
  OTP: number,
  customer_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer_otp SET otp = ?, otp_creation = ? WHERE customer_id = ?`;
  try {
    const result = await connection.query(sql, [
      OTP,
      convertLocalTimeToUTC(),
      customer_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleVerifyOTP = async (
  customer_id: number,
  OTP: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql =
    "SELECT * FROM customer_otp WHERE otp = ? and customer_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120";
  try {
    const result = await connection.query(sql, [OTP, customer_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSendEmailLink = async (
  signUpToken: string,
  email: string
) => {
  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
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
      .then((response: any) => {
        console.log(response);
        return;
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const handleSignUp = async (
  username: string,
  password: string,
  email: string,
  phoneNumber: number,
  referral_id: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET username = ?, password = ?, phone_number = ?, referred_by = ?, date_created = NULL WHERE email = ? AND active = 0`;
  try {
    const customer_id =
      referral_id != "null"
        ? await handleGetCustomerIdByRefId(referral_id)
        : null;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(sql, [
      username,
      encryptedPassword,
      phoneNumber,
      customer_id,
      email,
    ]);
    if (((result[0] as any).affectedRows as number) === 0) {
      const sql2 = `INSERT INTO customer (username, password, email, phone_number, date_created, referred_by) VALUES (?, ?, ?, ?, NULL, ?)`;
      const result2 = await connection.query(sql2, [
        username,
        encryptedPassword,
        email,
        phoneNumber,
        customer_id,
      ]);
      return (result2[0] as any).insertId as number;
    } else {
      const sql2 = `SELECT customer_id FROM customer WHERE email =  ?`;
      const result2 = await connection.query(sql2, [email]);
      return ((result2[0] as any)[0] as any).customer_id as number;
    }
  } catch (err: any) {
    if (err.errno === 1062) {
      return 1062;
    } else {
      throw new Error(err);
    }
  } finally {
    await connection.release();
  }
};

export const handleGetCustomerIdByRefId = async (
  referral_id: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT customer_id FROM customer WHERE referral_id = ?`;
  try {
    const result: any = await connection.query(sql, [referral_id]);
    return result[0][0]?.customer_id ? result[0][0].customer_id : null;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleActiveAccount = async (
  customer_id: string,
  referral_id: string | null
): Promise<number> => {
  const promisePool = pool.promise();
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
    return (result3[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleLogOut = async (refreshToken: string): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET refresh_token = '' WHERE refresh_token = ?`;
  try {
    const result = await connection.query(sql, [refreshToken]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleForgetPassword = async (
  email: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT * FROM customer WHERE email = ? AND active = 1`;
  try {
    const result = await connection.query(sql, [email]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSendEmailForgetPassword = async (
  forgetPasswordToken: string,
  email: string
) => {
  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
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
      .then((response: any) => {
        console.log(response);
        return;
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const handleResetPassword = async (
  password: string,
  customer_id: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET password = ? WHERE customer_id = ? AND active = 1`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(sql, [
      encryptedPassword,
      customer_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetReferralId = async (
  customer_id: string
): Promise<string> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT referral_id FROM customer WHERE customer_id = ?`;
  try {
    const result: any = await connection.query(sql, [customer_id]);
    return result[0][0].referral_id as string;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

const convertLocalTimeToUTC = (): string => {
  const now = new Date();

  const utcYear = now.getUTCFullYear();
  const utcMonth = padZero(now.getUTCMonth() + 1);
  const utcDay = padZero(now.getUTCDate());
  const utcHours = padZero(now.getUTCHours());
  const utcMinutes = padZero(now.getUTCMinutes());
  const utcSeconds = padZero(now.getUTCSeconds());

  return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`;
};

const padZero = (value: number): string => {
  return value.toString().padStart(2, "0");
};

interface LoginResult {
  customer_id: number;
  username: string;
  phone_number: number;
  email: string;
}

//ALLISON :D

export const handleGetCoins = async (customer_id: string): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT coins FROM customer WHERE customer_id = ?`;
  try {
    const result: any = await connection.query(sql, [customer_id]);
    return result[0][0].coins as number;
  } catch (err: any) {
    throw new Error(err);
  }
};

// NHAT TIEN :D

export const handlesUpdateCustomerLastViewedCat = async (
  categoryId: number,
  customerId: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET last_viewed_cat_id = ? WHERE customer_id = ?;`;
  try {
    const result = await connection.query(sql, [categoryId, customerId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
