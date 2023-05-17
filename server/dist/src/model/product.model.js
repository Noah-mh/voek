"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlesGetAllListedProducts = exports.handlesCheckWishlistProductExistence = exports.handleProductReviews = exports.handleProductDetailsWithoutReviews = exports.handlesDeletingWishlistedProduct = exports.handlesInsertingWishlistedProduct = exports.handlesProductsBasedOnCategory = exports.handlesSearchResult = exports.handlesSearchBarPredictions = exports.handlesTopProducts = exports.handlesGetLastViewed = exports.handlesGetWishlistItems = exports.handlesGetRecommendedProductsBasedOnCat = exports.handlesGetCartDetails = exports.handlesGetProductDetails = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handlesGetProductDetails = async (productId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.product_id, p.name, p.price, p.description, pv.variation_1, pv.variation_2, r.rating, r.comment 
  FROM products p
  INNER JOIN product_variations pv ON p.product_id = pv.product_id
  LEFT JOIN review r ON pv.sku = r.sku
  WHERE p.product_id = ?;`;
    try {
        const result = await connection.query(sql, [productId]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetProductDetails = handlesGetProductDetails;
const handlesGetCartDetails = async (customerId) => {
    const promisePool = database_1.default.promise();
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
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetCartDetails = handlesGetCartDetails;
const handlesGetRecommendedProductsBasedOnCat = async (category_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id , products.name, products.description, products.price 
  FROM category, products 
  WHERE category.category_id = 1 and category.category_id = products.category_id 
  LIMIT 6;`;
    try {
        const result = await connection.query(sql, [category_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetRecommendedProductsBasedOnCat = handlesGetRecommendedProductsBasedOnCat;
const handlesGetWishlistItems = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name, products.description, products.price
  FROM wishlist
  JOIN customer ON wishlist.customer_id = customer.customer_id
  JOIN products ON wishlist.product_id = products.product_id
  WHERE wishlist.customer_id = ?;`;
    try {
        const result = await connection.query(sql, [customer_id]);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetWishlistItems = handlesGetWishlistItems;
const handlesGetLastViewed = async (customer_id, date_viewed) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name, products.description, products.price
  FROM last_viewed
  JOIN customer ON last_viewed.customer_id = customer.customer_id
  JOIN products ON last_viewed.product_id = products.product_id
  WHERE last_viewed.customer_id = ? and last_viewed.date_viewed LIKE ?;`;
    const params = [customer_id, `${date_viewed}%`];
    try {
        const result = await connection.query(sql, params);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetLastViewed = handlesGetLastViewed;
const handlesTopProducts = async () => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT DISTINCT products.product_id, products.name, products.description 
  FROM (SELECT orders_product.product_id FROM orders_product) x 
  JOIN products ON x.product_id = products.product_id 
  GROUP BY x.product_id;`;
    try {
        const result = await connection.query(sql, []);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesTopProducts = handlesTopProducts;
const handlesSearchBarPredictions = async () => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id;`;
    try {
        const result = await connection.query(sql, []);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesSearchBarPredictions = handlesSearchBarPredictions;
const handlesSearchResult = async (input) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name, products.price, products.description
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id
  WHERE products.name LIKE ?;`;
    console.log("input", input);
    const params = [`%${input}%`];
    try {
        const result = await connection.query(sql, params);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesSearchResult = handlesSearchResult;
const handlesProductsBasedOnCategory = async (category_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id
  JOIN category ON  products.category_id = category.category_id
  WHERE category.category_id = ?;`;
    try {
        const result = await connection.query(sql, [category_id]);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesProductsBasedOnCategory = handlesProductsBasedOnCategory;
const handlesInsertingWishlistedProduct = async (customer_id, product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO wishlist (customer_id, product_id) VALUES (?, ?);`;
    try {
        const result = await connection.query(sql, [
            customer_id,
            product_id,
        ]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesInsertingWishlistedProduct = handlesInsertingWishlistedProduct;
const handlesDeletingWishlistedProduct = async (customer_id, product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `DELETE FROM wishlist WHERE wishlist.customer_id = ? and wishlist.product_id = ?;`;
    try {
        const result = await connection.query(sql, [customer_id, product_id]);
        console.log(result[0]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesDeletingWishlistedProduct = handlesDeletingWishlistedProduct;
const handleProductDetailsWithoutReviews = async (product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT 
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
        'variation_2', variation_2
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
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleProductDetailsWithoutReviews = handleProductDetailsWithoutReviews;
const handleProductReviews = async (product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.name,
  (SELECT JSON_ARRAYAGG(COALESCE(image_url, 'test/1_cksdtz'))
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
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleProductReviews = handleProductReviews;
const handlesCheckWishlistProductExistence = async (customer_id, product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT * FROM wishlist WHERE wishlist.customer_id = ? and wishlist.product_id = ?;`;
    try {
        const result = await connection.query(sql, [
            customer_id,
            product_id,
        ]);
        console.log(result[0]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesCheckWishlistProductExistence = handlesCheckWishlistProductExistence;
const handlesGetAllListedProducts = async () => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT products.product_id, products.name 
  FROM listed_products
  JOIN products ON  listed_products.product_id = products.product_id;`;
    try {
        const result = await connection.query(sql, []);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetAllListedProducts = handlesGetAllListedProducts;
//# sourceMappingURL=product.model.js.map