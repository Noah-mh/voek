import { connect } from "http2";
import pool from "../../config/database";

export const handlesGetCartDetails = async (customerId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT cart.product_id, cart.customer_id, product_variations.sku, products.name, product_variations.variation_1, product_variations.variation_1, product_images.image_id FROM cart JOIN products ON cart.product_id = products.product_id JOIN product_variations ON products.product_id = product_variations.product_id 
  LEFT JOIN product_images ON product_variations.product_id = product_images.product_id`;
  try {
    const result = await connection.query(sql, [customerId]);
    console.log("Results received:");
    console.log(result[0].length);
    return result[0];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleAlterCart = async (
  customer_id: number,
  sku: string,
  quantity: number,
  new_sku: string,
  product_id: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  if (quantity === 0 && !new_sku) {
    //If quantity of object hits 0, it will be deleted, and no new sku is defined
    const sql = `DELETE FROM cart WHERE customer_id = ? AND sku = ?`;
    try {
      const result = await connection.query(sql, [customer_id, sku]);
      console.log(result);
      return result;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
  } else if (!new_sku) {
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
  } else {
    //new product variation has changed.
    const sql = `UPDATE cart SET sku = ? WHERE customer_id = ? AND sku = ? AND product_id= ?`;

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
  }
};

// export const handleAlterSKUCart = async (cart_id: number, sku: string, new_sku: string, product_id: number ) => {
//     const promisePool = pool.promise();
//     const connection = await promisePool.getConnection();

// }
