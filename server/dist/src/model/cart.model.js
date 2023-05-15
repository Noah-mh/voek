"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlterCart = exports.handlesGetCartDetails = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handlesGetCartDetails = async (customerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.product_id, p.name, c.quantity, p.price, p.image_url, pv.variation_1, pv.variation_2, pv.quantity AS stock
    FROM cart c
    INNER JOIN  product_variations pv ON  c.sku = pv.sku
    LEFT JOIN products p ON p.product_id = pv.product_id 
    WHERE c.customer_id = ?
      `;
    try {
        const result = await connection.query(sql, [customerId]);
        console.log("Results received:");
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
const handleAlterCart = async (customer_id, sku, quantity, new_sku, product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    if (quantity === 0 && !new_sku) {
        //If quantity of object hits 0, it will be deleted, and no new sku is defined
        const sql = `DELETE FROM cart WHERE customer_id = ? AND sku = ?`;
        try {
            const result = await connection.query(sql, [customer_id, sku]);
            console.log(result);
            return result;
        }
        catch (err) {
            throw new Error(err);
        }
        finally {
            await connection.release();
        }
    }
    else if (!new_sku) {
        //no new sku is provided, so only quantity has changed.
        const sql = `UPDATE cart SET quantity = ? WHERE customer_id = ? AND sku = ?`;
        try {
            const result = await connection.query(sql, [quantity, customer_id, sku]);
            console.log(result);
        }
        catch (err) {
            throw new Error(err);
        }
        finally {
            await connection.release();
        }
    }
    else {
        //new product variation has changed.
        const sql = `UPDATE cart SET sku = ? WHERE customer_id = ? AND sku = ? AND product_id= ?`;
        try {
            const result = await connection.query(sql, [
                new_sku,
                customer_id,
                sku,
                product_id,
            ]);
            console.log(result);
            return result;
        }
        catch (err) {
            throw new Error(err);
        }
        finally {
            await connection.release();
        }
    }
};
exports.handleAlterCart = handleAlterCart;
// export const handleAlterSKUCart = async (cart_id: number, sku: string, new_sku: string, product_id: number ) => {
//     const promisePool = pool.promise();
//     const connection = await promisePool.getConnection();
// }
//# sourceMappingURL=cart.model.js.map