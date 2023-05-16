import { connect } from "http2";
import pool from "../../config/database";

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

export const handlesGetCartDetails = async (
  customerId: number
): Promise<CartItem[]> => {
  console.log("Connected to getCart Model");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT  cart.product_id, cart.customer_id, cart.quantity, products.price, product_variations.sku, products.name, product_variations.variation_1, product_variations.variation_2, product_variations.quantity AS stock FROM cart JOIN products ON cart.product_id = products.product_id JOIN product_variations ON products.product_id = product_variations.product_id WHERE cart.sku = product_variations.sku AND customer_id = ?`;
  try {
    const result = await connection.query(sql, [customerId]);
    return result[0] as CartItem[];
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
  console.log("Connected to alterQuant Model");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  if (quantity === 0) {
    console.log(quantity);
    //If quantity of object hits 0, it will be deleted, and no new sku is defined
    const sql = `DELETE FROM cart WHERE customer_id = ? AND sku = ?`;
    try {
      const result = await connection.query(sql, [customer_id, sku]);
      console.log("Successfully deleted??");
      console.log(result);
      return result;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
  } else {
    //no new sku is provided, so only quantity has changed.
    const sql = `UPDATE cart SET quantity = ? WHERE customer_id = ? AND sku = ?`;
    try {
      const result = await connection.query(sql, [quantity, customer_id, sku]);

      console.log(result);
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
  }
};

export const handleAlterSKUCart = async (
  customer_id: number,
  sku: string,
  new_sku: string,
  product_id: number
): Promise<any> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  //new product variation has changed.
  const sql = `UPDATE cart SET sku = ? WHERE customer_id = ? AND sku = ? AND product_id = ?`;

  try {
    const result = await connection.query(sql, [
      new_sku,
      customer_id,
      sku,
      product_id,
    ]);
    console.log(result);
    return result;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
