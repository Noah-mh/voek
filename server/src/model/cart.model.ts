import { connect } from "http2";
import { OkPacket } from "mysql2";
import pool from "../../config/database";
import { NumberSchema, StringSchema } from "yup";
import { query } from "express";

export const handlesGetCartDetails = async (
  customer_id: string
): Promise<CartItem[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT listed_products.seller_id, cart.product_id, cart.customer_id, cart.quantity, product_variations.price, product_variations.sku, products.name, product_variations.variation_1, product_variations.variation_2,product_images.image_url,  product_variations.quantity AS stock FROM cart JOIN products ON cart.product_id = products.product_id LEFT JOIN product_images ON cart.sku = product_images.sku JOIN product_variations ON products.product_id = product_variations.product_id JOIN listed_products ON listed_products.product_id = cart.product_id WHERE cart.sku = product_variations.sku AND customer_id = ?`;
  try {
    const result = await connection.query(sql, [customer_id]);
    if (Array.isArray(result[0]) && result[0].length === 0) {
      return [] as CartItem[];
    } else {
      return result[0] as CartItem[];
    }
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleAlterQuantCart = async (
  customer_id: number,
  sku: string,
  quantity: number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  if (quantity === 0) {
    //If quantity of object hits 0, it will be deleted, and no new sku is defined
    const sql = `DELETE FROM cart WHERE customer_id = ? AND sku = ?`;
    try {
      const result = await connection.query(sql, [customer_id, sku]);
      return result;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
  } else {
    //only update quantity
    const sql = `UPDATE cart SET quantity = ? WHERE customer_id = ? AND sku = ?`;
    try {
      const result = await connection.query(sql, [quantity, customer_id, sku]);
      return result;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
  }
};

export const handleInsertPayment = async (
  customer_id: number,
  amount: number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO payment (customer_id, amount) VALUES (?,?)`;

  try {
    const [result] = await connection.query(sql, [customer_id, amount]);
    return (result as OkPacket).insertId as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleInsertOrder = async (
  customer_id: number,
  payment_id: number,
  discount_applied: string,
  coins_redeemed: number,
  address_id: number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO orders (customer_id, payment_id, discount_applied, coins_redeemed, address_id) VALUES (?,?,?,?,?)`;

  try {
    const [result] = await connection.query(sql, [
      customer_id,
      payment_id,
      discount_applied,
      coins_redeemed,
      address_id,
    ]);

    return (result as OkPacket).insertId as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleInsertOrderProduct = async (
  sku: string,
  orders_id: number,
  product_id: number,
  totalPrice: number,
  quantity: number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO orders_product (sku, orders_id, product_id, total_price, quantity) VALUES (?,?,?,?,?)`;

  try {
    const [result] = await connection.query(sql, [
      sku,
      orders_id,
      product_id,
      totalPrice,
      quantity,
    ]);

    return (result as OkPacket).insertId as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleUpdateProductStock = async (
  quantityDeduct: number,
  sku: string
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE product_variations SET quantity = quantity - ? WHERE sku = ?;`;

  try {
    const result = await connection.query(sql, [quantityDeduct, sku]);

    return (result[0] as OkPacket).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleAlterCustomerCoins = async (
  customer_id: Number,
  coins: Number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer SET coins = (coins + ?) WHERE customer_id = ?; `;
  try {
    const result = await connection.query(sql, [coins, customer_id]);

    return (result[0] as OkPacket).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleClearCart = async (customer_id: number): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `DELETE FROM cart WHERE customer_id = ? `;

  try {
    const [result] = await connection.query(sql, [customer_id]);

    return (result as OkPacket).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleRedeemVoucher = async (
  customer_voucher_id: number,
  order_id: number
): Promise<any> => {
  let test = order_id.toString();
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE customer_voucher SET redeemed = 0, orders_id = ? WHERE customer_voucher_id = ? `;

  try {
    const [result] = await connection.query(sql, [
      order_id,
      customer_voucher_id,
    ]);
    return (result as OkPacket).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
// NHAT TIEN :D
export const handlesInsertCart = async (
  quantity: number,
  customerId: number,
  productId: number,
  SKU: string
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO cart (quantity, customer_id, product_id, SKU) VALUES (?, ?, ?, ?);`;
  try {
    const [result] = await connection.query(sql, [
      quantity,
      customerId,
      productId,
      SKU,
    ]);
    return (result as OkPacket).insertId as number;
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      const sql = `UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ? AND SKU = ?;`;
      try {
        const [result] = await connection.query(sql, [
          quantity,
          customerId,
          productId,
          SKU,
        ]);
        return (result as OkPacket).insertId as number;
      } catch (err: any) {
        throw new Error(err);
      }
    }
  } finally {
    await connection.release();
  }
};

interface Product {
  product_id: number;
  name: string;
  price: number;
  image_url: string;
}

interface ProductVariation {
  variation_1: string;
  variation_2: string;
  quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  variations: ProductVariation;
  stock: number;
}

export interface CartDetails extends Array<CartItem> {}

export interface CartItemUpdate {
  customer_id: number;
  sku: string;
  quantity: number;
  new_sku?: string;
  product_id?: number;
}
