import pool from "../../config/database";
import bcrypt from "bcrypt";
import Sib from "../../config/sendInBlue";
import client from "../../config/teleSign";
import config from "../../config/config";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({
  path: __dirname + "../../env",
});

import { v4 as uuidv4 } from "uuid";
import { time } from "console";

interface SubmitVariationsInterface {
  var1: string;
  var2: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku?: string;
}

// GET all products from 1 seller
export const handleGetAllProductsOfSeller = async (
  sellerId: number
): Promise<any[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.product_id, p.name, p.description, p.active, pv.sku, pv.variation_1, pv.variation_2, pv.quantity, pv.price, pv.active AS availability, p.category_id, c.name AS category, pi.image_url FROM products p
    RIGHT OUTER JOIN listed_products lp 
    ON lp.product_id = p.product_id
    LEFT JOIN product_variations pv
    ON pv.product_id = p.product_id
    INNER JOIN category c
    ON c.category_id = p.category_id
    LEFT JOIN product_images pi
    ON pi.sku = pv.sku    
    WHERE lp.seller_id = ?
    AND pv.valid_variation = 1 
    ORDER BY p.product_id ASC;`;
  try {
    const result: any = await connection.query(sql, [sellerId]);
    return result[0] as any[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

// GET best sellers
export const handleGetBestSellers = async (
  sellerId: number
): Promise<any[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT op.product_id AS productId, p.name, c.name AS category, SUM(op.quantity) AS totalQuantity
    FROM orders_product op
    INNER JOIN products p ON p.product_id = op.product_id
    INNER JOIN category c ON p.category_id = c.category_id
    INNER JOIN listed_products lp ON op.product_id = lp.product_id
    WHERE lp.seller_id = ?
    GROUP BY op.product_id
    ORDER BY totalQuantity DESC
    LIMIT 5;`;
  try {
    const result: any = await connection.query(sql, [sellerId]);
    return result[0] as any[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

// GET all categories
export const handleGetAllCategories = async (): Promise<any[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT category_id AS categoryId, name FROM category
    ORDER BY name ASC;`;
  try {
    const result: any = await connection.query(sql);
    return result[0] as any[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

// POST insert a new product
export const handleAddProduct = async (
  sellerId: number,
  name: string,
  description: string,
  categoryId: number,
  variations: Array<SubmitVariationsInterface>,
  quantity: number,
  price: number,
  imageUrl: string
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const insertProducts = `INSERT INTO products (name, description, category_id)
    SELECT name, description, category_id FROM (SELECT ? AS name, ? AS description, ? AS category_id) AS temp
    WHERE NOT EXISTS (SELECT p.name, p.description, p.category_id FROM products p WHERE p.name = ? AND p.description = ? AND p.category_id = ?);`;
  const insertListedProducts = `INSERT INTO listed_products (product_id, seller_id)
    VALUES (?, ?);`;
  const insertProductVariations = `INSERT INTO product_variations (sku, product_id, variation_1, variation_2, quantity, price)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const insertProductImages = `INSERT INTO product_images (product_id, image_url, sku)
    VALUES (?, ?, ?);`;

  try {
    // start a local transaction
    connection.beginTransaction();
    // insert into products table unless there is a duplicate, in which case lasatInsertId will be 0
    return Promise.resolve(
      connection.query(insertProducts, [
        name,
        description,
        categoryId,
        name,
        description,
        categoryId,
      ])
    )
      .then(async (response) => {
        let lastInsertId = Object.values(response[0])[2];
        // if product exists, do not insert into products table and return lastInsertId
        if (lastInsertId === 0) {
          return lastInsertId;
        } else {
          let lastInsertId = Object.values(response[0])[2];
          // insert into listed products table
          await connection.query(insertListedProducts, [
            lastInsertId,
            sellerId,
          ]);
          // if variations exist, map variations
          if (variations.length !== 0) {
            await Promise.all(
              variations.map(async (variation) => {
                // create sku
                const sku = uuidv4();
                // insert into product variations table
                connection.query(insertProductVariations, [
                  sku,
                  lastInsertId,
                  variation.var1,
                  variation.var2 ? variation.var2 : null,
                  variation.quantity,
                  variation.price,
                ]);
                // insert into product images table
                connection.query(insertProductImages, [
                  lastInsertId,
                  variation.imageUrl,
                  sku,
                ]);
                return lastInsertId;
              })
            );
          } else {
            // create sku
            const sku = uuidv4();
            connection.query(insertProductVariations, [
              sku,
              lastInsertId,
              null,
              null,
              quantity,
              price,
            ]);
            connection.query(insertProductImages, [
              lastInsertId,
              imageUrl,
              sku,
            ]);
            return lastInsertId;
          }
          return lastInsertId;
        }
      })
      .then((response) => {
        return response as number;
      });
  } catch (err: any) {
    connection.rollback();
    connection.release();
    console.log(err);
    throw new Error(err);
  } finally {
    connection.commit();
    await connection.release();
  }
};

// POST update product
export const handleEditProduct = async (
  productId: number,
  keys: string[],
  values: string[],
  variations: Array<SubmitVariationsInterface>
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let updateProducts = `UPDATE products SET `;
  const updateProductVariationsValid = `UPDATE product_variations SET valid_variation = 0 WHERE product_id = ?;`;
  const updateProductVariations = `UPDATE product_variations SET quantity = ?, price = ?, valid_variation = 1 WHERE sku = ?;`;
  // getSku template
  // getSku = `DELETE FROM product_images WHERE sku = ? AND image_url = ?;`;
  // let getSku = `SELECT
  //   IF(COUNT(*) > 0, 'Table', 'UUID') AS source,
  //   IF(COUNT(*) > 0, (SELECT sku FROM product_variations WHERE product_id = ?
  //                     AND (variation_1 = ? OR variation_1 IS NULL)
  //                     AND (variation_2 = ? OR variation_2 IS NULL)), UUID()) AS sku
  //   FROM (
  //     SELECT 1
  //     FROM product_variations
  //     WHERE product_id = ?
  //       AND (variation_1 = ? OR variation_1 IS NULL)
  //       AND (variation_2 = ? OR variation_2 IS NULL)
  //     LIMIT 1
  //   ) AS subquery;`;
  let getSku1 = `SELECT
    IF(COUNT(*) > 0, 'Table', 'UUID') AS source,
    IF(COUNT(*) > 0, (SELECT sku FROM product_variations WHERE product_id = ?`;
  let getSku2 = `), UUID()) AS sku
    FROM (
      SELECT 1
      FROM product_variations
      WHERE product_id = ?`;
  let getSku3 = `LIMIT 1
    ) AS subquery;`;
  let getSkuVar1 = ` AND variation_1 = ? `;
  let getSkuVar1Null = ` AND variation_1 IS NULL `;
  let getSkuVar2 = ` AND variation_2 = ? `;
  let getSkuVar2Null = ` AND variation_2 IS NULL `;
  const insertProductVariations = `INSERT INTO product_variations (sku, product_id, variation_1, variation_2, quantity, price)
    VALUES (?, ?, ?, ?, ?, ?);`;
  const insertProductImages = `INSERT INTO product_images (product_id, image_url, sku)
    VALUES (?, ?, ?);`;
  const updateProductImages = `UPDATE product_images SET image_url = ? WHERE sku = ?`;

  try {
    connection.beginTransaction();
    // console.log("begin transaction");

    if (keys.length > 0) {
      // build the updateProducts query
      for (let i = 0; i < keys.length; i++) {
        updateProducts += `${keys[i]} = ?, `;
      }
      updateProducts = updateProducts.slice(0, -2);
      updateProducts += ` WHERE product_id = ?;`;
      // console.log("updateProducts", updateProducts);

      let tempArr: (string | number)[] = [...values, productId];
      // console.log("tempArr", tempArr);
      await connection.query(updateProducts, tempArr);
      // console.log("products table updated");
    }

    // reset product variations valid_variations column to 0, will set it back to 1 if it is a valid variation
    await connection.query(updateProductVariationsValid, [productId]);

    // products without variations will have variations.length === 1 with the var1 and var2 properties set to null
    await Promise.all(
      variations.map(async (variation) => {
        // console.log("variation.sku", variation.sku);
        // if variation already exists in product variations table and is active
        if (variation.sku !== "") {
          // console.log("variation already exists in product variations table and is active");
          // update product variations table, also sets valid_variation to 1
          await connection.query(updateProductVariations, [
            variation.quantity,
            variation.price,
            variation.sku,
          ]);
          // update product images table
          await connection.query(updateProductImages, [
            variation.imageUrl,
            variation.sku,
          ]);
          // console.log("active existing variation updated");
        } else {
          // if variation has no sku, then variation does not exist in product variations table or exists but is not active
          // get sku if variation exists but is not active, otherwise, create sku
          // console.log("no sku yet")
          // build getSku query
          let getSku = "";
          let parameters = [];
          if (variation.var1 && variation.var2) {
            getSku =
              getSku1 +
              getSkuVar1 +
              getSkuVar2 +
              getSku2 +
              getSkuVar1 +
              getSkuVar2 +
              getSku3;
            parameters = [
              productId,
              variation.var1,
              variation.var2,
              productId,
              variation.var1,
              variation.var2,
            ];
          } else if (variation.var1) {
            getSku =
              getSku1 +
              getSkuVar1 +
              getSkuVar2Null +
              getSku2 +
              getSkuVar1 +
              getSkuVar2Null +
              getSku3;
            parameters = [
              productId,
              variation.var1,
              productId,
              variation.var1,
            ];
          } else {
            getSku =
              getSku1 +
              getSkuVar1Null +
              getSkuVar2Null +
              getSku2 +
              getSkuVar1Null +
              getSkuVar2Null +
              getSku3;
            parameters = [productId, productId];
          }
          // console.log("getSku", getSku);
          // console.log("parameters", parameters)
          await connection
            .query(getSku, parameters)
            .then(async (response) => {
              let exists = Object.values(response[0])[0].source;
              let sku = Object.values(response[0])[0].sku;
              // console.log("exists", exists);
              // console.log("sku", sku);
              // if variation exists but is not active
              if (exists === "Table") {
                // console.log("variation exists but is not active")
                // update product variations table, also sets valid_variation to 1
                await connection.query(updateProductVariations, [
                  variation.quantity,
                  variation.price,
                  sku,
                ]);
                // update product images table
                await connection.query(updateProductImages, [
                  variation.imageUrl,
                  sku,
                ]);
                // console.log("inactive but existing variation updated, active now");
              } else {
                // if variation does not exist
                // console.log("variation does not exist")
                // insert into product variations table
                connection.query(insertProductVariations, [
                  sku,
                  productId,
                  variation.var1 ? variation.var1 : null,
                  variation.var2 ? variation.var2 : null,
                  variation.quantity,
                  variation.price,
                ]);
                // insert into product images table
                connection.query(insertProductImages, [
                  productId,
                  variation.imageUrl,
                  sku,
                ]);
                // console.log("new variation inserted, active now");
              }
              return productId;
            });
        }
      })
    );
  } catch (err: any) {
    connection.rollback();
    connection.release();
    console.log(err);
    throw new Error(err);
  } finally {
    connection.commit();
    // console.log("ended transaction");
    await connection.release();
  }
};

// PUT product variation active
export const handleUpdateProductVariationActive = async (
  active: boolean,
  productId: number,
  sku: string
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql1 = `UPDATE product_variations SET active = ? WHERE sku = ?;`;
  const sql2 = `UPDATE products SET active = true WHERE product_id = ?;`;
  const sql3 = `UPDATE products p
  SET p.active = ?
  WHERE p.product_id = ?
  AND NOT EXISTS (
    SELECT 1
    FROM product_variations pv
    WHERE pv.product_id = p.product_id
    AND pv.active = 1
  );`;

  try {
    connection.beginTransaction();

    const result1: any = await connection.query(sql1, [active, sku]);

    if (active) {
      const result2: any = await connection.query(sql2, [productId]);
    } else {
      const result3: any = await connection.query(sql3, [
        active,
        productId,
      ]);
    }
    connection.commit();
    return result1[0].affectedRows as number;
  } catch (err: any) {
    connection.rollback();
    connection.release();
    console.log(err);
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

// PUT product active
export const handleUpdateProductActive = async (
  active: boolean,
  productId: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql1 = `UPDATE products SET active = ? WHERE product_id = ?;`;
  const sql2 = `UPDATE product_variations SET active = ? WHERE product_id = ?;`;
  try {
    connection.beginTransaction();

    const result1: any = await connection.query(sql1, [
      active,
      productId,
    ]);
    const result2: any = await connection.query(sql2, [
      active,
      productId,
    ]);
    connection.commit();
    return result1[0].affectedRows as number;
  } catch (err: any) {
    connection.rollback();
    connection.release();
    console.log(err);
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

// GET order details
export const handleGetOrderDetails = async (
  ordersId: number
): Promise<Orders> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT c.username, c.email, op.total_price, o.orders_date, s.shipment_created, s.shipment_delivered FROM orders o
    INNER JOIN customer c 
    ON o.customer_id = c.customer_id
    INNER JOIN orders_product op
    ON o.orders_id = op.orders_id
    LEFT JOIN shipment s
    ON o.shipment_id = s.shipment_id
    WHERE o.orders_id = ?;`;
  try {
    const result: any = await connection.query(sql, [ordersId]);
    return result[0] as Orders;
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleLogin = async (
  email: string,
  password: string
): Promise<Seller | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT password, seller_id, phone_number, shop_name, email FROM seller WHERE email = ?`;
  try {
    const result: any = await connection.query(sql, [email]);
    const encryptrdPassword = result[0].length
      ? result[0][0].password
      : "";
    const check = await bcrypt.compare(password, encryptrdPassword);
    if (check) {
      const seller_id: number = result[0][0]?.seller_id;
      const phone_number: number = result[0][0]?.phone_number;
      const email: string = result[0][0]?.email;
      const shopName: string = result[0][0]?.shop_name;
      return { seller_id, phone_number, email, shopName };
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
  seller_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET refresh_token =? WHERE seller_id =?`;
  try {
    const result = await connection.query(sql, [
      refreshtoken,
      seller_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSendSMSOTP = async (
  phoneNumber: number,
  seller_id: number
) => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const result = await updateOTP(OTP, seller_id);
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
    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const handleSendEmailOTP = async (
  email: string,
  seller_id: number
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

    const result = await updateOTP(OTP, seller_id);

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "OTP Verification For VOEK Seller Login",
        textContent: `Your OTP is ${OTP}`,
      })
      .then((response: any) => {
        console.log(response);
        return result;
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
  seller_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller_otp SET otp = ?, otp_creation = ? WHERE seller_id = ?`;
  try {
    const result = await connection.query(sql, [
      OTP,
      convertLocalTimeToUTC(),
      seller_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleVerifyOTP = async (
  seller_id: number,
  OTP: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql =
    "SELECT * FROM seller_otp WHERE otp = ? and seller_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120";
  try {
    const result = await connection.query(sql, [OTP, seller_id]);
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
        subject: "Verification Link For VOEK seller Sign Up",
        textContent: `${
          process.env.FRONTEND_BASE_URL || "http://localhost:5173"
        }/seller/signup/verify?signupToken=${signUpToken}`,
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
  shopName: string,
  password: string,
  email: string,
  phoneNumber: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET shop_name = ?, password = ?, phone_number = ?, date_created = NULL WHERE email = ? AND active = 0`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(sql, [
      shopName,
      encryptedPassword,
      phoneNumber,
      email,
    ]);
    if (((result[0] as any).affectedRows as number) === 0) {
      const sql2 = `INSERT INTO seller (shop_name, password, email, phone_number, date_created) VALUES (?, ?, ?, ?, NULL)`;
      const result2 = await connection.query(sql2, [
        shopName,
        encryptedPassword,
        email,
        phoneNumber,
      ]);
      return (result2[0] as any).insertId as number;
    } else {
      const sql2 = `SELECT seller_id FROM seller WHERE email =  ?`;
      const result2 = await connection.query(sql2, [email]);
      return ((result2[0] as any)[0] as any).seller_id as number;
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

export const handleActiveAccount = async (
  seller_id: string
): Promise<number> => {
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
};

export const handleLogOut = async (
  refreshToken: string
): Promise<number> => {
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
};

export const handleForgetPassword = async (
  email: string
): Promise<Object[]> => {
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
        subject: "VPassword reset link for seller",
        textContent: `${
          process.env.FRONTEND_BASE_URL || "http://localhost:5173"
        }/seller/forgetPassword/verify?forgetPasswordToken=${forgetPasswordToken}`,
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
  seller_id: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller SET password = ? WHERE seller_id = ? AND active = 1`;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(sql, [
      encryptedPassword,
      seller_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSellerOrders = async (
  seller_id: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, orders.orders_date, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN customer ON orders.customer_id = customer.customer_id
      JOIN products ON orders_product.product_id = products.product_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NULL
  ORDER BY orders.orders_date DESC
  `;
  try {
    const result = await connection.query(sql, [seller_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSellerShipped = async (
  seller_id: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, shipment.shipment_created, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN shipment on orders_product.shipment_id = shipment.shipment_id
      JOIN products ON orders_product.product_id = products.product_id
    JOIN customer ON orders.customer_id = customer.customer_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NULL
  ORDER BY orders.orders_date DESC
  `;
  try {
    const result = await connection.query(sql, [seller_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSellerDelivered = async (
  seller_id: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, shipment.shipment_delivered, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN shipment on orders_product.shipment_id = shipment.shipment_id
      JOIN products ON orders_product.product_id = products.product_id
    JOIN customer ON orders.customer_id = customer.customer_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NOT NULL
  ORDER BY orders.orders_date DESC
  `;
  try {
    const result = await connection.query(sql, [seller_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlePackedAndShipped = async (
  orders_product_id: Array<string>,
  customer_id: string
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO shipment (orders_product_id, customer_id) VALUES(?, ?)`;
  try {
    orders_product_id.forEach(async (orders_product_id) => {
      const result = await connection.query(sql, [
        orders_product_id,
        customer_id,
      ]);
      const sql2 = `UPDATE orders_product SET shipment_id = ? WHERE orders_product_id = ?`;
      const result2 = await connection.query(sql2, [
        (result[0] as any).insertId,
        orders_product_id,
      ]);
    });
    return;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetCustomerOrders = async (
  seller_id: number,
  orders_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT
  orders.orders_id,
  customer.username,
  customer_address.postal_code,
  customer_address.block,
  customer_address.unit_no,
  customer_address.street_name,
  customer.email,
  customer.phone_number,
  orders.orders_date,
  product_variations.sku,
  product_variations.variation_1,
  product_variations.variation_2,
  products.name,
  products.description,
  orders_product.product_id,
  orders.customer_id,
  orders_product.orders_product_id,
  orders_product.total_price,
  orders_product.quantity,
  orders_product.shipment_id,
  shipment.shipment_created,
  shipment.shipment_delivered
FROM
  orders
  JOIN orders_product ON orders.orders_id = orders_product.orders_id
  JOIN customer ON orders.customer_id = customer.customer_id
  JOIN customer_address ON orders.address_id = customer_address.address_id
  JOIN product_variations ON orders_product.sku = product_variations.sku
  JOIN products ON product_variations.product_id = products.product_id
  LEFT JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
WHERE
  orders.orders_id = ?
  AND orders_product.product_id IN (
    SELECT listed_products.product_id
    FROM listed_products
    WHERE seller_id = ?
  )`;
  try {
    const result = await connection.query(sql, [
      orders_id,
      seller_id,
    ]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSellerDetails = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT email, phone_number, image_url, shop_name FROM seller WHERE seller_id = ?`;
  try {
    const result = await connection.query(sql, [seller_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleUpdateSellerDetails = async (
  password: string,
  email: string,
  shop_name: string,
  phone_number: number,
  seller_id: number
): Promise<Object | undefined> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    let sql = `SELECT * FROM seller WHERE email like ? and seller_id != ?`;
    let result = (await connection.query(sql, [
      email,
      seller_id,
    ])) as any;
    if (result[0].length != 0) {
      return { duplicateEmail: true };
    } else {
      let sql = `SELECT * FROM seller WHERE email like ? and seller_id = ?`;
      let result = (await connection.query(sql, [
        email,
        seller_id,
      ])) as any;
      if (result[0].length === 0) {
        sql =
          "UPDATE update_seller SET new_email = ?, email_sent = utc_timestamp() WHERE seller_id = ?";
        result = await connection.query(sql, [email, seller_id]);
        if (result[0].affectedRows === 0) {
          sql =
            "INSERT INTO update_seller (seller_id, new_email, email_sent) VALUES (?, ?, utc_timestamp())";
          result = await connection.query(sql, [seller_id, email]);
        }
        await handleSendEmailChange(seller_id, email);
        if (password) {
          const encryptedPassword = await bcrypt.hash(password, 10);
          sql = `UPDATE seller SET password = ?, shop_name = ?, phone_number = ? WHERE seller_id = ?`;
          result = await connection.query(sql, [
            encryptedPassword,
            shop_name,
            phone_number,
            seller_id,
          ]);
        } else {
          sql =
            "UPDATE seller SET shop_name = ?, phone_number = ? WHERE seller_id = ?";
          result = await connection.query(sql, [
            shop_name,
            phone_number,
            seller_id,
          ]);
        }
        return { emailChange: true };
      } else {
        if (password) {
          const encryptedPassword = await bcrypt.hash(password, 10);
          sql = `UPDATE seller SET password = ?, shop_name = ?, phone_number = ? WHERE seller_id = ?`;
          result = await connection.query(sql, [
            encryptedPassword,
            shop_name,
            phone_number,
            seller_id,
          ]);
        } else {
          sql =
            "UPDATE seller SET shop_name = ?, phone_number = ? WHERE seller_id = ?";
          result = await connection.query(sql, [
            shop_name,
            phone_number,
            seller_id,
          ]);
        }
      }
    }
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSendEmailChange = async (
  seller_id: number,
  email: string
) => {
  const changeSellerEmailToken = jwt.sign(
    {
      seller_id: seller_id,
    },
    config.emailTokenSecret!,
    { expiresIn: "300s" }
  );
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
      subject: "Verification Link For VOEK seller Email Change",
      textContent: `${
        process.env.FRONTEND_BASE_URL || "http://localhost:5173"
      }/seller/email-verification?token=${changeSellerEmailToken}`,
    })
    .then((response: any) => {
      console.log(response);
      return;
    })
    .catch((err: any) => {
      throw new Error(err);
    });
};

export const handleChangeEmail = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    let sql = `SELECT new_email FROM update_seller WHERE seller_id = ?`;
    let result = (await connection.query(sql, [seller_id])) as any;
    const email = result[0][0].new_email;
    sql = `UPDATE seller SET email = ? WHERE seller_id = ?`;
    result = await connection.query(sql, [email, seller_id]);
    sql = `DELETE FROM update_seller WHERE seller_id = ?`;
    result = await connection.query(sql, [seller_id]);
    return;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleDeactivateAccount = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "UPDATE seller SET active = 0 WHERE seller_id = ?";
  try {
    const result = await connection.query(sql, [seller_id]);
    return;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSellerStatus = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "SELECT active FROM seller WHERE seller_id = ?";
  try {
    const result = (await connection.query(sql, [seller_id])) as any;
    return result[0][0].active;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleActivateAccount = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "UPDATE seller SET active = 1 WHERE seller_id = ?";
  try {
    const result = await connection.query(sql, [seller_id]);
    return;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleViewVouchers = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT voucher_id, voucher_name, number_amount, percentage_amount, voucher_category, min_spend, active FROM seller_voucher WHERE seller_id = ?`;
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetSoldCategories = async (
  seller_id: number,
  time_period: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql: string = "";
  if (time_period === "all") {
    sql = `SELECT 
	SUM(category.category_id) as value,
    category.name
FROM 
    orders
JOIN 
    orders_product ON orders.orders_id = orders_product.orders_id
JOIN 
	products ON orders_product.product_id = products.product_id
JOIN
	category ON products.category_id = category.category_id
JOIN 
	listed_products ON products.product_id = listed_products.product_id
WHERE 
    listed_products.seller_id = ?
GROUP BY
	category.category_id`;
  } else if (time_period === "week") {
    sql = `SELECT 
    SUM(category.category_id) as value,
      category.name
  FROM 
      orders
  JOIN 
      orders_product ON orders.orders_id = orders_product.orders_id
  JOIN 
    products ON orders_product.product_id = products.product_id
  JOIN
    category ON products.category_id = category.category_id
  JOIN 
    listed_products ON products.product_id = listed_products.product_id
  WHERE 
      listed_products.seller_id = ?
    AND YEAR(orders.orders_date) = YEAR(CURDATE())
      AND WEEK(orders.orders_date) = WEEK(CURDATE())
  GROUP BY
    category.category_id`;
  } else if (time_period === "month") {
    sql = `SELECT 
    SUM(category.category_id) as value,
      category.name
  FROM 
      orders
  JOIN 
      orders_product ON orders.orders_id = orders_product.orders_id
  JOIN 
    products ON orders_product.product_id = products.product_id
  JOIN
    category ON products.category_id = category.category_id
  JOIN 
    listed_products ON products.product_id = listed_products.product_id
  WHERE 
      listed_products.seller_id = ?
    AND DATE_FORMAT(orders.orders_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  GROUP BY
    category.category_id`;
  }
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetBestSellingProducts = async (
  seller_id: number,
  time_period: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql: string = "";
  if (time_period === "all") {
    sql = `SELECT 
    SUM(orders_product.quantity) as amount,
      products.name
  FROM 
      orders
  JOIN 
      orders_product ON orders.orders_id = orders_product.orders_id
  JOIN 
    products ON orders_product.product_id = products.product_id
  JOIN 
    listed_products ON products.product_id = listed_products.product_id
  WHERE 
      listed_products.seller_id = ?
  GROUP BY
    products.product_id
  LIMIT 10`;
  } else if (time_period === "month") {
    sql = `SELECT 
    SUM(orders_product.quantity) as amount,
      products.name
  FROM 
      orders
  JOIN 
      orders_product ON orders.orders_id = orders_product.orders_id
  JOIN 
    products ON orders_product.product_id = products.product_id
  JOIN 
    listed_products ON products.product_id = listed_products.product_id
  WHERE 
      listed_products.seller_id = ?
    AND DATE_FORMAT(orders.orders_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  GROUP BY
    products.product_id
  LIMIT 10`;
  } else if (time_period === "week") {
    sql = `SELECT 
    SUM(orders_product.quantity) as amount,
      products.name
  FROM 
      orders
  JOIN 
      orders_product ON orders.orders_id = orders_product.orders_id
  JOIN 
    products ON orders_product.product_id = products.product_id
  JOIN 
    listed_products ON products.product_id = listed_products.product_id
  WHERE 
      listed_products.seller_id = ?
      AND YEAR(orders.orders_date) = YEAR(CURDATE())
    AND WEEK(orders.orders_date) = WEEK(CURDATE())GROUP BY
    products.product_id
  LIMIT 10`;
  }
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetAllSellers = async (): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT seller.seller_id, seller.shop_name, seller.image_url FROM seller RIGHT JOIN seller_voucher ON seller.seller_id = seller_voucher.seller_id WHERE seller.seller_id IS NOT NULL GROUP BY seller_voucher.seller_id`;
  try {
    const [result] = await connection.query(sql);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetRevenue = async (
  seller_id: number,
  time_period: string
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql: string = "";
  if (time_period === "all") {
    sql = `SELECT
    DATE(o.orders_date) AS orders_day,
    COALESCE(SUM(op.total_price), 0) AS total_revenue
  FROM
    orders_product op
  INNER JOIN
    orders o ON op.orders_id = o.orders_id
  INNER JOIN
    listed_products lp ON op.product_id = lp.product_id
  WHERE
    lp.seller_id = ?
  GROUP BY
    DATE(o.orders_date)
  ORDER BY
    orders_day;`;
  } else if (time_period === "month") {
    sql = `SELECT
    DATE(o.orders_date) AS orders_day,
    COALESCE(SUM(op.total_price), 0) AS total_revenue
  FROM
    orders_product op
  INNER JOIN
    orders o ON op.orders_id = o.orders_id
  INNER JOIN
    listed_products lp ON op.product_id = lp.product_id
  WHERE
    lp.seller_id = ?
    AND o.orders_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
  GROUP BY
    DATE(o.orders_date)
  ORDER BY
    orders_day;`;
  } else if (time_period === "week") {
    sql = `SELECT
    DATE(o.orders_date) AS orders_day,
    COALESCE(SUM(op.total_price), 0) AS total_revenue
  FROM
    orders_product op
  INNER JOIN
    orders o ON op.orders_id = o.orders_id
  INNER JOIN
    listed_products lp ON op.product_id = lp.product_id
  WHERE
    lp.seller_id = ?
    AND o.orders_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  GROUP BY
    DATE(o.orders_date)
  ORDER BY
    orders_day;`;
  } else if (time_period === "today") {
    sql = `SELECT
    DATE_FORMAT(o.orders_date, '%Y-%m-%d %H:00') AS date_hour,
    COALESCE(SUM(op.total_price), 0) AS total_revenue
  FROM
    orders_product op
  INNER JOIN
    orders o ON op.orders_id = o.orders_id
  INNER JOIN
    listed_products lp ON op.product_id = lp.product_id
  WHERE
    lp.seller_id = ?
    AND o.orders_date >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
  GROUP BY
    DATE_FORMAT(o.orders_date, '%Y-%m-%d %H:00')
  ORDER BY
    date_hour;`;
  }
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetTotalRevenue = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT COALESCE(SUM(op.total_price), 0) AS total_revenue
  FROM listed_products lp
  LEFT JOIN orders_product op ON lp.product_id = op.product_id
  WHERE lp.seller_id = ?;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetPercentileOfTotalRevenue = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT ROUND(COALESCE(revenue.total_revenue / highest_total_revenue.highest_revenue * 100, 0), 2) AS revenue_percentile
  FROM (
      SELECT COALESCE(SUM(op.total_price), 0) AS total_revenue
      FROM listed_products lp
      LEFT JOIN orders_product op ON lp.product_id = op.product_id
      WHERE lp.seller_id = ?
  ) revenue
  CROSS JOIN (
      SELECT COALESCE(MAX(total_revenue), 0) AS highest_revenue
      FROM (
          SELECT COALESCE(SUM(op.total_price), 0) AS total_revenue
          FROM listed_products lp
          LEFT JOIN orders_product op ON lp.product_id = op.product_id
          GROUP BY lp.seller_id
      ) max_revenue
  ) AS highest_total_revenue;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetTotalProductsSold = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT COALESCE(SUM(op.quantity), 0) AS total_products_sold FROM orders_product op 
  INNER JOIN listed_products lp ON op.product_id = lp.product_id
  WHERE lp.seller_id = ?;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetPercentileOfTotalProductsSold = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT ROUND(COALESCE(products_count.total_products_sold / max_products_count.highest_products_sold * 100, 0), 2) AS product_percentile
  FROM (
      SELECT COALESCE(SUM(op.quantity), 0) AS total_products_sold FROM orders_product op 
    INNER JOIN listed_products lp ON op.product_id = lp.product_id
    WHERE lp.seller_id = ?
  ) products_count
  CROSS JOIN (
      SELECT COALESCE(MAX(max_products_count_alias.total_products_sold), NULL) AS highest_products_sold
      FROM (
          SELECT COALESCE(SUM(op.quantity), 0) AS total_products_sold FROM orders_product op 
      INNER JOIN listed_products lp ON op.product_id = lp.product_id
      GROUP BY lp.seller_id
      ) max_products_count_alias
  ) AS max_products_count; `;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetTotalCustomers = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT COUNT(DISTINCT customer_id) AS total_customers FROM orders o
  INNER JOIN orders_product op ON o.orders_id = op.orders_id
  INNER JOIN listed_products lp ON op.product_id = lp.product_id
  WHERE lp.seller_id = ?;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetPercentileOfTotalCustomers = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT ROUND(COALESCE(customers_count.customer_count / highest_count_alias.highest_customer_count * 100, 0), 2) AS customer_percentile
  FROM (
      SELECT lp.seller_id, COALESCE(COUNT(DISTINCT o.customer_id), 0) AS customer_count
      FROM orders o
      INNER JOIN orders_product op ON o.orders_id = op.orders_id
      INNER JOIN listed_products lp ON op.product_id = lp.product_id
      WHERE lp.seller_id = ?
  ) customers_count
  CROSS JOIN (
      SELECT COALESCE(MAX(highest_count.customer_count), NULL) AS highest_customer_count
      FROM (
          SELECT COUNT(DISTINCT customer_id) AS customer_count 
          FROM orders o
          INNER JOIN orders_product op ON o.orders_id = op.orders_id
          INNER JOIN listed_products lp ON op.product_id = lp.product_id
          GROUP BY lp.seller_id
      ) highest_count
  ) AS highest_count_alias;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetAverageRatingOfProducts = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating FROM review r
  LEFT JOIN listed_products lp ON r.product_id = lp.product_id
  WHERE lp.seller_id = ?;`;

  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetRatingPercentileOfProducts = async (
  seller_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let sql = `SELECT
  CASE
    WHEN COUNT(*) > 0 THEN
      (
        SELECT COALESCE(ROUND((average_rating / highest_rating * 100), 2), 0)
        FROM (
          SELECT
            lp.seller_id,
            COALESCE(ROUND(MAX(r.rating), 2), 0) AS highest_rating,
            COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
            RANK() OVER (ORDER BY COALESCE(ROUND(AVG(r.rating), 2), 0) DESC) AS rating_rank
          FROM review r
          LEFT JOIN listed_products lp ON r.product_id = lp.product_id
          GROUP BY lp.seller_id
        ) ratings
        WHERE ratings.seller_id = ?
      )
    ELSE 0.00
  END AS rating_percentile
FROM review r
INNER JOIN listed_products lp ON r.product_id = lp.product_id
WHERE lp.seller_id = ?;`;

  try {
    const [result] = await connection.query(sql, [
      seller_id,
      seller_id,
    ]);
    return result as Object[];
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
