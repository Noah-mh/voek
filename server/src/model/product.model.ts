import pool from "../../config/database";

export const handlesGetProductDetails = async (productId: number): Promise<ProductDetails[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.product_id, p.name, p.price, p.description, pv.variation_1, pv.variation_2, r.rating, r.comment 
  FROM products p
  INNER JOIN product_variations pv ON p.product_id = pv.product_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE p.product_id = ?;`;
  try {
    const result = await connection.query(sql, [productId]);
    return result[0] as ProductDetails[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetCartDetails = async (customerId: number): Promise<ProductDetails[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.product_id, p.name, c.quantity, p.price, p.image_url, pv.variation_1, pv.variation_2
  FROM cart c
  INNER JOIN  product_variations pv ON  c.sku = pv.sku
  LEFT JOIN products p ON p.product_id = pv.product_id 
  WHERE c.customer_id = ?
    `;
  try {
    const result = await connection.query(sql, [customerId]);
    console.log(result[0]);
    return result[0] as ProductDetails[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetRecommendedProductsBasedOnCat = async (
  category_id: number
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id , products.name, products.description, products.price 
  FROM category, products 
  WHERE category.category_id = 1 and category.category_id = products.category_id 
  LIMIT 6;`;
  try {
    const result = await connection.query(sql, [category_id]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetWishlistItems = async (
  customer_id: number
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name, products.description, products.price
  FROM wishlist
  JOIN customer ON wishlist.customer_id = customer.customer_id
  JOIN products ON wishlist.product_id = products.product_id
  WHERE wishlist.customer_id = ?;`;
  try {
    const result = await connection.query(sql, [customer_id]);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetLastViewed = async (
  customer_id: number,
  date_viewed: string
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name, products.description
  FROM last_viewed
  JOIN customer ON last_viewed.customer_id = customer.customer_id
  JOIN products ON last_viewed.product_id = products.product_id
  WHERE last_viewed.customer_id = ? and last_viewed.date_viewed LIKE "2023-05-09%";`;
  const params = [customer_id, `${date_viewed}%`];
  try {
    const result = await connection.query(sql, [
      customer_id,
      date_viewed,
    ]);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesTopProducts = async (): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT DISTINCT products.product_id, products.name, products.description 
  FROM (SELECT orders_product.product_id FROM orders_product) x 
  JOIN products ON x.product_id = products.product_id 
  GROUP BY x.product_id;`;
  try {
    const result = await connection.query(sql, []);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesSearchBarPredictions = async (): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id;`;
  try {
    const result = await connection.query(sql, []);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesSearchResult = async (input: string): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id
  WHERE products.name LIKE ?;`;
  const params = [`%${input}%`];
  try {
    const result = await connection.query(sql, params);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesProductsBasedOnCategory = async (
  category_id: number
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id
  JOIN category ON  products.category_id = category.category_id
  WHERE category.category_id = ?;`;
  try {
    const result = await connection.query(sql, [category_id]);
    console.log(result[0]);
    return result[0] as Product[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesInsertingWishlistedProduct = async (
  customer_id: number,
  product_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO wishlist (customer_id, product_id) VALUES (?, ?);`;
  try {
    const result = await connection.query(sql, [
      customer_id,
      product_id,
    ])
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesDeletingWishlistedProduct = async (
  customer_id: number,
  product_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `DELETE FROM wishlist WHERE wishlist.customer_id = ? and wishlist.product_id = ?;`;
  try {
    const result = await connection.query(sql, [
      customer_id,
      product_id,
    ]);
    console.log(result[0]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
export const handleProductDetailsWithoutReviews = async (
  product_id: number
): Promise<ProductWithImages[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT 
  JSON_ARRAYAGG(COALESCE(pi.image_url, 'test/1_cksdtz')) AS image_urls,
  p.name,
  p.description,
  GROUP_CONCAT(
    DISTINCT JSON_OBJECT(
      'variation_1',  pv.variation_1,
      'variation_2', pv.variation_2
    )
  ) AS variations
FROM products p
INNER JOIN product_variations pv ON p.product_id = pv.product_id
LEFT JOIN product_images pi ON p.product_id = pi.product_id
WHERE p.product_id = ?
GROUP BY
  p.name,
  p.description
    `;

  try {
    const result = await connection.query(sql, product_id);
    console.log(result[0]);
    return result[0] as ProductWithImages[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleProductReviews = async (product_id: number): Promise<Review[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT p.name,
  (SELECT JSON_ARRAYAGG(image_url)
   FROM product_images pi
   WHERE pi.product_id = p.product_id) AS image_urls,
  ROUND(AVG(r.rating), 2) AS rating,
  (SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'customerName', c.username,
            'comment', r.comment
          ))
   FROM review r
   INNER JOIN customer c ON r.customer_id = c.customer_id
   WHERE r.sku IN (
     SELECT pv.sku
     FROM product_variations pv
     WHERE pv.product_id = p.product_id
   )) AS reviews
FROM products p
LEFT JOIN review r ON p.product_id = r.product_id
WHERE p.product_id = ?
GROUP BY p.product_id, p.name;
    `;

  try {
    const result = await connection.query(sql, product_id);
    console.log(result[0]);
    return result[0] as Review[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesCheckWishlistProductExistence = async (
  customer_id: number,
  product_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT * FROM wishlist WHERE wishlist.customer_id = ? and wishlist.product_id = ?;`;
  try {
    console.log(sql);
    const result = await connection.query(sql, [
      customer_id,
      product_id,
    ]);
    console.log(result[0]);
    return result[0] as Array<Object>;
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
  description: string;
}

interface ProductDetails extends Product {
  variation_1: string;
  variation_2: string;
  rating: number;
  comment: string;
}

interface ProductWithImages extends Product {
  image_urls: string[];
}

interface Review {
  customerName: string;
  comment: string;
}

