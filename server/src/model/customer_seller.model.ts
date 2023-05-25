import pool from "../../config/database";

export const handleSellerDetails = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT s.seller_id, s.shop_name, s.image_url, COUNT(lp.product_id) AS total_product
  FROM seller s
  LEFT JOIN listed_products lp ON s.seller_id = lp.seller_id
  WHERE s.seller_id = ?
  GROUP BY s.seller_id;`;
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as seller[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSellerCategories = async (seller_id: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT DISTINCT c.category_id, c.name as category_name
  FROM listed_products lp
  INNER JOIN products p ON lp.product_id = p.product_id
  INNER JOIN category c ON p.category_id = c.category_id
  WHERE lp.seller_id = ?;`;
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Category[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSellerProductsDetails = async (
  seller_id: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.product_id, 
  p.name, 
  pv.price,
  pv.sku,
  ROUND(AVG(r.rating), 2) as rating,
  c.category_id, 
  c.name as category_name,
  (SELECT pi.image_url 
   FROM product_images pi 
   WHERE pi.product_id = p.product_id 
   LIMIT 1) as image_url
  FROM listed_products lp
  INNER JOIN products p ON lp.product_id = p.product_id
  INNER JOIN product_variations pv ON p.product_id = pv.product_id
  INNER JOIN category c ON p.category_id = c.category_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE lp.seller_id = ?
  GROUP BY p.product_id, p.name, pv.price, pv.sku, c.category_id, c.name;
`;
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSellerProductsByCategory = async (
  seller: number,
  category: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.product_id, 
  p.name, 
  pv.price,
  pv.sku,
  ROUND(AVG(r.rating), 2) as rating,
  c.category_id, 
  c.name as category_name,
  (SELECT pi.image_url 
   FROM product_images pi 
   WHERE pi.product_id = p.product_id 
   LIMIT 1) as image_url
  FROM listed_products lp
  INNER JOIN products p ON lp.product_id = p.product_id
  INNER JOIN product_variations pv ON p.product_id = pv.product_id
  INNER JOIN category c ON p.category_id = c.category_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE lp.seller_id = ? AND c.category_id =?
  GROUP BY p.product_id, p.name, pv.price, pv.sku, c.category_id, c.name;
`;
  try {
    const [result] = await connection.query(sql, [seller, category]);
    return result as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

interface Product {
  product_id: number;
  name: string;
  price: number;
  sku: string;
  rating: number;
  category_id: number;
  category_name: string;
}

interface seller {
  seller_id: number;
  shop_name: string;
  image_url: string;
  total_product: number;
}

interface Category {
  category_id: number;
  name: string;
}
