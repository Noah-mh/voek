import pool from "../../config/database";
import { OkPacket, ResultSetHeader } from "mysql2";

export const handleAddingReview = async (
  product_id: number,
  customer_id: number,
  rating: number,
  comment: string,
  sku: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
      INSERT INTO review 
      (product_id, customer_id, rating, comment, sku) 
      VALUES (?, ?, ?, ?, ?)
    `;
  try {
    const [result] = await connection.query(sql, [
      product_id,
      customer_id,
      rating,
      comment,
      sku,
    ]);
    return (result as OkPacket).insertId as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleAddingReviewImages = async (
  review_id: number,
  image_url: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO review_images (review_id, image_url) VALUES (?, ?)`;
  try {
    const [result] = await connection.query(sql, [
      review_id,
      image_url,
    ]);
    return (result as ResultSetHeader).affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleDeleteReview = async (
  review_id: number,
  sku: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `DELETE FROM review WHERE review_id = ? AND sku = ?`;
  try {
    const [result] = await connection.query(sql, [review_id, sku]);
    return (result as ResultSetHeader).affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleCustomerRated = async (
  orders_product_id: number,
  customer_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
  UPDATE shipment
  SET shipment.rated = 1
  WHERE orders_product_id = ? AND customer_id = ?
  `;
  try {
    const [result] = await connection.query(sql, [
      orders_product_id,
      customer_id,
    ]);
    console.log("update shipment rated")
    return (result as ResultSetHeader).affectedRows;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetCustomerRated = async (
  customer_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
  SELECT shipment.rated ,shipment.orders_product_id
  FROM orders
  JOIN orders_product ON orders.orders_id = orders_product.orders_id
  JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
  WHERE shipment.shipment_delivered IS NOT NULL AND orders.customer_id = ?  
  `;
  try {
    const [result] = await connection.query(sql, [customer_id]);
    return result as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
