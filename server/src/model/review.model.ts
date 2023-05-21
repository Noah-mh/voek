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
