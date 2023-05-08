import pool from "../../config/database";

export const getProductDetails = async (productId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.name, p.price, p.description, pv.variation_1, pv.variation_2, r.rating, r.comment 
  FROM products p
  INNER JOIN product_variations pv ON p.product_id = pv.product_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE p.product_id = ?
    `;
  try {
    const result = await connection.query(sql, [productId]);
    console.log(result[0]);
    return result[0];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
