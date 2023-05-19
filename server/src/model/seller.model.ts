import pool from '../../config/database';
import bcrypt from 'bcrypt';
import Sib from '../../config/sendInBlue';
import client from '../../config/teleSign';

// GET all products from 1 seller
export const handleGetAllProducts = async (sellerId: number): Promise<any[]> => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = 
    `SELECT p.product_id, p.name, p.description, p.active, pv.sku, pv.variation_1, pv.variation_2, pv.quantity, pv.price, p.category_id, c.name AS category FROM products p
    RIGHT OUTER JOIN listed_products lp 
    ON lp.product_id = p.product_id
    LEFT JOIN product_variations pv
    ON pv.product_id = p.product_id
    INNER JOIN category c
    ON c.category_id = p.category_id
    WHERE lp.seller_id = ? AND pv.active = 1
    ORDER BY p.product_id ASC;`;
    try {
        const result: any = await connection.query(sql, [sellerId]);
        return result[0] as any[];
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

// GET all categories
export const handleGetAllCategories = async (): Promise<any[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = 
  `SELECT category_id, name FROM category
  ORDER BY name ASC;`;
  try {
      const result: any = await connection.query(sql);
      return result[0] as any[];
  } catch (err: any) {
      console.log(err);
      throw new Error(err);
  } finally {
      await connection.release();
  }
}

// POST insert a new product
export const handleAddProduct = async (sellerId: number, name: string, description: string, category_id: number, variation_1: string, variation_2: string, quantity: number, price: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql1 = 
  `INSERT INTO products (name, description, category_id)
  VALUES (?, ?, ?);`;
  const sql2 = 
  `INSERT INTO listed_products (product_id, seller_id)
  VALUES (?, ?);`;
  const sql3 = 
  `INSERT INTO product_variations (sku, product_id, variation_1, variation_2, quantity, price)
  VALUES (UUID(), ?, ?, ?, ?, ?)`;

  try {
    // start a local transaction
    connection.beginTransaction();

    const result1: any = await connection.query(sql1, [name, description, category_id])
    // // console.log(response);
    let lastInsertId = result1[0].insertId;
    console.log(lastInsertId)
    const result2: any = await connection.query(sql2, [lastInsertId, sellerId]);
    const result3: any = await connection.query(sql3, [lastInsertId, variation_1, variation_2, quantity, price]);

    // variation_1 .join with , then .split with ,
    // then run sql3 thru a for loop w [variation_1[i]] for every variation_2

    // result1 = await Promise.resolve(connection.query(sql1, [name, description, category_id]))
    // .then((response) => {
    //   // console.log("response", response)
    //   // console.log("result1", result1)
    //   // console.log(result1[0].insertId)
    //   // console.log(response[0].insertId)

    //   let lastInsertId = result1[0].insertId;
    //   const result2: any = connection.query(sql2, [lastInsertId, sellerId]);
    //   const result3: any = connection.query(sql3, [lastInsertId, variation_1, variation_2, quantity, price]);
    // })

    connection.commit();
    return;
  } catch (err: any) {
    connection.rollback()
    connection.release();
    console.log(err);
    throw new Error(err);
  } finally {
      await connection.release();
  }
}


// GET order details
export const handleGetOrderDetails = async (ordersId: number): Promise<Orders> => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = 
    `SELECT c.username, c.email, op.total_price, o.orders_date, s.shipment_created, s.shipment_delivered FROM orders o
    INNER JOIN customer c 
    ON o.customer_id = c.customer_id
    INNER JOIN orders_product op
    ON o.orders_id = op.orders_id
    LEFT JOIN shipment s
    ON o.shipment_id = s.shipment_id
    WHERE o.orders_id = ?;`
    try {
        const result: any = await connection.query(sql, [ordersId]);
        return result[0] as Orders;
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    } finally {
        await connection.release()
    }
}


export const handleLogin = async (email: string, password: string): Promise<Seller | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT password, seller_id, phone_number, shop_name, email FROM seller WHERE email = ?`;
  try {
    const result: any = await connection.query(sql, [email]);
    const encryptrdPassword = result[0].length ? result[0][0].password : '';
    const check = await bcrypt.compare(password, encryptrdPassword);
    if (check) {
      const seller_id: number = result[0][0]?.seller_id;
      const phone_number: number = result[0][0]?.phone_number;
      const email: string = result[0][0]?.email;
      const shopName: string = result[0][0]?.shop_name;
      return { seller_id, phone_number, email, shopName }
    }
    return null;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

export const handleStoreRefreshToken = async (refreshtoken: string, seller_id: number): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET refresh_token =? WHERE seller_id =?`;
  try {
    const result = await connection.query(sql, [refreshtoken, seller_id]);
    return (result[0] as any).affectedRows as number;
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
    return result;
  } catch (err: any) {
    throw new Error(err);
  }
}

export const handleSendEmailOTP = async (email: string, seller_id: number): Promise<any> => {
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
      return result;
    }).catch((err: any) => {
      throw new Error(err);
    })
  } catch (err: any) {
    throw new Error(err);
  }
}

export const updateOTP = async (OTP: number, seller_id: number): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller_otp SET otp = ?, otp_creation = ? WHERE seller_id = ?`;
  try {
    const result = await connection.query(sql, [OTP, convertLocalTimeToUTC(), seller_id]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

export const handleVerifyOTP = async (seller_id: number, OTP: number): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = 'SELECT * FROM seller_otp WHERE otp = ? and seller_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120';
  try {
    const result = await connection.query(sql, [OTP, seller_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

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
        textContent: `http://localhost:5173/seller/signup/verify?signupToken=${signUpToken}`,
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

export const handleSignUp = async (shopName: string, password: string, email: string, phoneNumber: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET shop_name = ?, password = ?, phone_number = ?, date_created = NULL WHERE email = ? AND active = 0`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10)
    const result = await connection.query(sql, [shopName, encryptedPassword, phoneNumber, email]);
    if ((result[0] as any).affectedRows as number === 0) {
      const sql2 = `INSERT INTO seller (shop_name, password, email, phone_number, date_created) VALUES (?, ?, ?, ?, NULL)`;
      const result2 = await connection.query(sql2, [shopName, encryptedPassword, email, phoneNumber]);
      return (result2[0] as any).insertId as number
    } else {
      const sql2 = `SELECT seller_id FROM seller WHERE email =  ?`;
      const result2 = await connection.query(sql2, [email]);
      return ((result2[0] as any)[0] as any).seller_id as number
    }
  } catch (err: any) {
    if (err.errno === 1062) {
      return 1062
    } else {
      throw new Error(err);
    }
  } finally {
    await connection.release();
  }
}

export const handleActiveAccount = async (seller_id: string): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET active = 1 WHERE seller_id = ?`;
  try {
    const result = await connection.query(sql, [seller_id]);
    const sql2 = `UPDATE seller SET date_created = utc_timestamp()`;
    const result2 = await connection.query(sql2, null);
    const sql3 = `INSERT INTO seller_otp (seller_id) VALUES (?)`;
    const result3 = await connection.query(sql3, [seller_id]);
    return (result3[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

export const handleLogOut = async (refreshToken: string): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET refresh_token = '' WHERE refresh_token = ?`;
  try {
    const result = await connection.query(sql, [refreshToken]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

export const handleForgetPassword = async (email: string): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT * FROM seller WHERE email = ? AND active = 1`;
  try {
    const result = await connection.query(sql, [email]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
}

export const handleSendEmailForgetPassword = async (forgetPasswordToken: string, email: string) => {
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
        textContent: `http://localhost:5173/seller/forgetPassword/verify?forgetPasswordToken=${forgetPasswordToken}`,
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
}

export const handleResetPassword = async (password: string, seller_id: string): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET password = ? WHERE seller_id = ? AND active = 1`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10)
    const result = await connection.query(sql, [encryptedPassword, seller_id]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
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

  
interface Orders {
    customer_username: string;
    customer_email: string;
    total_price: number;
    orders_date: Date;
    shipment_created: Date;
    shipment_delivered: Date;
}

interface Seller {
    seller_id: number;
    phone_number: number;
    email: string;
    shopName: string;
}
  
