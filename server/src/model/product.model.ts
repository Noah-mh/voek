import pool from "../../config/database";
import { OkPacket } from "mysql2";

//Noah
export const handlesGetProductDetails = async (
  productId: number
): Promise<ProductDetails[]> => {
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

export const handlesGetCartDetails = async (
  customerId: number
): Promise<ProductDetails[]> => {
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
  const sql = `SELECT products.product_id , products.name, products.description
  FROM category, products 
  WHERE category.category_id = ? and category.category_id = products.category_id 
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

export const handlesGetRecommendedProductBasedOnCatWishlist = async (
  category_id: number
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id , products.name, products.description
  FROM category, products 
  WHERE category.category_id = ? and category.category_id = products.category_id 
  LIMIT 3;`;
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
  const sql = `SELECT products.product_id, products.name, products.description, products.category_id
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
  WHERE last_viewed.customer_id = ? and last_viewed.date_viewed LIKE ?;`;
  console.log("customerId", customer_id);
  const params = [customer_id, `${date_viewed}%`];
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

export const handlesSearchBarPredictions = async (): Promise<
  Product[]
> => {
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

export const handlesSearchResult = async (
  input: string
): Promise<Product[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name, products.description
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id
  WHERE products.name LIKE ?;`;
  console.log("input", input);
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
    ]);
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
    const result = await connection.query(sql, [customer_id, product_id]);
    console.log(result[0]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

//Noah
export const handleProductDetailsWithoutReviews = async (
  product_id: number
): Promise<ProductWithImages[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT 
  p.product_id,
  p.name,
  p.description,
  img.image_urls,
  var.variations
FROM products p
LEFT JOIN (
  SELECT 
    product_id,
    JSON_ARRAYAGG(image_url) AS image_urls
  FROM product_images
  GROUP BY product_id
) AS img ON p.product_id = img.product_id
LEFT JOIN (
  SELECT 
    product_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'variation_1', variation_1,
        'variation_2', variation_2,
        'price', price,
        'sku', sku,
        'quantity', quantity
      )
    ) AS variations
  FROM product_variations
  GROUP BY product_id
) AS var ON p.product_id = var.product_id
WHERE p.product_id = ?;
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

//Noah
export const handleProductReviews = async (
  product_id: number
): Promise<Review[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT 
  p.name,
  ROUND(AVG(r.rating), 2) AS rating,
  (SELECT 
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'customerName', c.username,
              'comment', r.comment,
              'image_urls', (SELECT 
                                  JSON_ARRAYAGG(
                                      COALESCE(ri.image_url, 'test/1_cksdtz')
                                  ) 
                              FROM 
                                  review_images ri
                              WHERE 
                                  ri.review_id = r.review_id)
          )
      )
  FROM 
      review r
      INNER JOIN customer c ON r.customer_id = c.customer_id
  WHERE 
      r.sku IN (
          SELECT 
              pv.sku
          FROM 
              product_variations pv
          WHERE 
              pv.product_id = p.product_id
      )
  ) AS reviews
FROM 
  products p
  LEFT JOIN review r ON p.product_id = r.product_id
WHERE 
  p.product_id = ?
GROUP BY 
  p.product_id, 
  p.name;
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

export const handlesGetAllListedProducts = async () => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id;`;
  try {
    const result = await connection.query(sql, []);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetProductVariations = async (
  productId: number
) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT * FROM product_variations WHERE product_variations.product_id = ?;`;
  try {
    const result = await connection.query(sql, [productId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};


export const handlesGetProductVariationsPricing = async (productId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT MIN(price) as lowestPrice, MAX(price) as highestPrice FROM product_variations WHERE product_id = ?;`;
  try {
    const result = await connection.query(sql, [productId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetProductImage = async (productId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT image_url as imageURL FROM product_images WHERE product_id = ? LIMIT 1;`;
  try {
    const result = await connection.query(sql, [productId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetProductVariationImage = async (sku: string) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT image_url as imageURL FROM product_images WHERE sku = ?;`;
  try {
    const result = await connection.query(sql, [sku]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetProductCat = async (productId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT category_id as categoryId FROM products WHERE product_id = ?;`;
  try {
    const result = await connection.query(sql, [productId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesInsertLastViewedProduct = async (productId: number, categoryId: number, customerId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO last_viewed (product_id, category_id, customer_id) VALUES (?, ?, ?);`;
  try {
    const result = await connection.query(sql, [productId, categoryId, customerId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};



//Noah
export const handleAddToCart = async (
  quantity: number,
  customer_id: number,
  product_id: number,
  sku: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  let insertId: number | undefined;

  try {
    const sql = `INSERT INTO cart (quantity, customer_id, product_id, sku) VALUES (?, ?, ?, ?);`;
    const [result] = await connection.query(sql, [
      quantity,
      customer_id,
      product_id,
      sku,
    ]);
    insertId = (result as OkPacket).insertId;
  } catch (err: any) {
    console.error(err);
    if (err.errno === 1062) {
      console.error("entered update");
      const sql = `UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ? AND sku = ?;`;
      try {
        const [result] = await connection.query(sql, [
          quantity,
          customer_id,
          product_id,
          sku,
        ]);
        insertId =
          (result as OkPacket).affectedRows > 0 ? product_id : 0;
      } catch (err: any) {
        console.error(err);
        throw new Error(err);
      }
    }
  } finally {
    await connection.release();
  }

  // Check if insertId is undefined, if so return a default value
  return insertId ?? 0;
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
