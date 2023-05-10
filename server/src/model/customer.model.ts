import pool from "../../config/database";
import bcrypt from "bcrypt";
import Sib from "../../config/sendInBlue";
import client from "../../config/teleSign";

export const handleLogin = async (email: string, password: string) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT username, password, customer_id, phone_number, email FROM customer WHERE email = ?`;
  try {
    const result = await connection.query(sql, [email]);
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
) => {
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
};

export const handleSendSMSOTP = async (
  phoneNumber: number,
  customer_id: number
) => {
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
    return result[0];
  } catch (err: any) {
    throw new Error(err);
  }
};

export const handleSendEmailOTP = async (
  email: string,
  customer_id: number
) => {
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
        return result[0];
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateOTP = async (OTP: number, customer_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer_otp SET otp = ?, otp_creation = ? WHERE customer_id = ?`;
  try {
    const result = await connection.query(sql, [
      OTP,
      convertLocalTimeToUTC(),
      customer_id,
    ]);
    return result[0].affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleVerifyOTP = async (customer_id: number, OTP: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql =
    "SELECT * FROM customer_otp WHERE otp = ? and customer_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120";
  try {
    console.log();
    const result = await connection.query(sql, [OTP, customer_id]);
    return result[0];
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
        textContent: `http://localhost:5173/signUp/${signUpToken}`,
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
  phoneNumber: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO customer (username, password, email, phone_number) VALUES (?, ?, ?, ?)`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(sql, [
      username,
      encryptedPassword,
      email,
      phoneNumber,
    ]);
    return result[0].affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleLogOut = async (refreshToken: number) => {};

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

export const handlesCustLastViewdCat = async (
  cat_id: number,
  customer_id: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET customer.last_viewed_id = ? WHERE customer.customer_id = ?;`;
  try {
    const result = await connection.query(sql, [cat_id, customer_id]);
    return result[0].affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
