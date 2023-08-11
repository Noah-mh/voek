import pool from "../../config/database";
//Noah's code
export const handleSellerDetailsBySellerId = async (
  seller_id: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT 
  s.seller_id, 
  s.shop_name, 
  s.image_url, 
  COUNT(DISTINCT lp.product_id) AS total_products, 
  COUNT(DISTINCT r.review_id) AS total_reviews, 
  s.date_created, 
  ROUND(AVG(r.rating), 2) AS rating
FROM 
  seller s
LEFT JOIN 
  listed_products lp ON s.seller_id = lp.seller_id
LEFT JOIN 
  review r ON lp.product_id = r.product_id
WHERE 
  s.seller_id = ? AND s.active = 1
GROUP BY 
  s.seller_id, s.shop_name, s.image_url, s.date_created;`;
  try {
    const [result] = await connection.query(sql, [seller_id]);
    return result as seller[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleSellerDetailsByProductId = async (
  product_id: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT 
  s.seller_id, 
  s.shop_name, 
  s.image_url,
  COUNT(DISTINCT lp2.product_id) AS total_products,
  COUNT(DISTINCT r.review_id) AS total_reviews, 
  s.date_created, 
  ROUND(AVG(r.rating), 2) AS rating
FROM 
  seller s
JOIN 
  listed_products lp ON s.seller_id = lp.seller_id
LEFT JOIN
  listed_products lp2 ON s.seller_id = lp2.seller_id
LEFT JOIN 
  review r ON lp2.product_id = r.product_id
WHERE 
  lp.product_id = ? AND s.active = 1
GROUP BY 
  s.seller_id, s.shop_name, s.image_url, s.date_created;

  `;
  try {
    const [result] = await connection.query(sql, [product_id]);
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
  const sql = `
  SELECT p.product_id, 
    p.name, 
    ROUND(AVG(r.rating), 2) as rating,
    (SELECT pv.price 
     FROM product_variations pv 
     WHERE pv.product_id = p.product_id 
     LIMIT 1) as price,
    (SELECT pi.image_url 
     FROM product_images pi 
     WHERE pi.product_id = p.product_id 
     LIMIT 1) as image_url
    FROM listed_products lp
    INNER JOIN products p ON lp.product_id = p.product_id            
    LEFT JOIN product_variations pv ON pv.product_id = p.product_id
    LEFT JOIN review r ON pv.sku = r.sku
    WHERE lp.seller_id = ?
    GROUP BY p.product_id, p.name;
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
  const sql = `  SELECT p.product_id, 
  p.name, 
  ROUND(AVG(r.rating), 2) as rating,
  (SELECT pv.price 
   FROM product_variations pv 
   WHERE pv.product_id = p.product_id 
   LIMIT 1) as price,
  (SELECT pi.image_url 
   FROM product_images pi 
   WHERE pi.product_id = p.product_id 
   LIMIT 1) as image_url
  FROM listed_products lp
  INNER JOIN products p ON lp.product_id = p.product_id            
  LEFT JOIN product_variations pv ON pv.product_id = p.product_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE lp.seller_id = ? AND p.category_id = ?
  GROUP BY p.product_id, p.name;
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
  total_products: number;
  total_reviews: number;
  date_created: Date;
}

interface Category {
  category_id: number;
  name: string;
}
