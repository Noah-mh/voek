
import { connect } from 'http2';
import pool from '../../config/database';

export const handlesGetCartDetails = async (customerId: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.product_id, p.name, c.quantity, p.price, p.image_url, pv.variation_1, pv.variation_2, pv.quantity AS stock
    FROM cart c
    INNER JOIN  product_variations pv ON  c.sku = pv.sku
    LEFT JOIN products p ON p.product_id = pv.product_id 
    WHERE c.customer_id = ?
      `;
    try {
      const result = await connection.query(sql, [customerId]);
      console.log(result[0]);
      return result[0];
    } catch (err: any) {
      throw new Error(err);
    } finally {
      await connection.release();
    }
};
  
export const alterQuantityCartDetails = async (cart_id: number, sku: string, quantity: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    if (quantity === 0) {
        const sql = `DELETE FROM cart WHERE cart_id = ? AND sku = ?`;
        try {
            const result = await connection.query(sql, [cart_id, sku]);
            console.log(result);
    
        } catch (err: any) {
            throw new Error(err);
        } finally {
            await connection.release();
        }
        return;
    }
    const sql = `UPDATE cart SET quantity = ? WHERE cart_id = ? AND sku = ?`;
    try {
        const result = await connection.query(sql, [quantity, cart_id, sku]);
        console.log(result);

    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
};
 
export const alterSKUCartDetails = async (cart_id: number, sku: string, new_sku: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
}