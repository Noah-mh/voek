"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteReview = exports.handleAddingReviewImages = exports.handleAddingReview = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handleAddingReview = async (product_id, customer_id, rating, comment, sku) => {
    const promisePool = database_1.default.promise();
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
        return result.insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleAddingReview = handleAddingReview;
const handleAddingReviewImages = async (review_id, image_url) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO review_images (review_id, image_url) VALUES (?, ?)`;
    try {
        const [result] = await connection.query(sql, [
            review_id,
            image_url,
        ]);
        return result.affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleAddingReviewImages = handleAddingReviewImages;
const handleDeleteReview = async (review_id, sku) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `DELETE FROM review WHERE review_id = ? AND sku = ?`;
    try {
        const [result] = await connection.query(sql, [review_id, sku]);
        return result.affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleDeleteReview = handleDeleteReview;
//# sourceMappingURL=review.model.js.map