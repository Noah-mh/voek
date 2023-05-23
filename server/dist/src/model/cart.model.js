"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlesInsertCart = exports.handleClearCart = exports.handleInsertShipment = exports.handleAlterCustomerCoins = exports.handleUpdateProductStock = exports.handleInsertOrderProduct = exports.handleInsertOrder = exports.handleInsertPayment = exports.handleAlterQuantCart = exports.handlesGetCartDetails = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handlesGetCartDetails = async (customer_id) => {
    console.log("Connected to getCart Model");
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT cart.product_id, cart.customer_id, cart.quantity, product_variations.price, product_variations.sku, products.name, product_variations.variation_1, product_variations.variation_2,product_images.image_url,  product_variations.quantity AS stock FROM cart JOIN products ON cart.product_id = products.product_id LEFT JOIN product_images ON cart.sku = product_images.sku JOIN product_variations ON products.product_id = product_variations.product_id WHERE cart.sku = product_variations.sku AND customer_id = ?`;
    try {
        const result = await connection.query(sql, [customer_id]);
        console.log("successfully handle got cart details");
        if (Array.isArray(result[0]) && result[0].length === 0) {
            return [];
        }
        else {
            return result[0];
        }
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlesGetCartDetails = handlesGetCartDetails;
const handleAlterQuantCart = async (customer_id, sku, quantity) => {
    console.log("Connected to alterQuant Model");
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    if (quantity === 0) {
        //If quantity of object hits 0, it will be deleted, and no new sku is defined
        const sql = `DELETE FROM cart WHERE customer_id = ? AND sku = ?`;
        try {
            const result = await connection.query(sql, [customer_id, sku]);
            console.log("Successfully deleted?? (Handle)");
            return result;
        }
        catch (err) {
            throw new Error(err);
        }
        finally {
            await connection.release();
        }
    }
    else {
        //only update quantity
        const sql = `UPDATE cart SET quantity = ? WHERE customer_id = ? AND sku = ?`;
        try {
            const result = await connection.query(sql, [quantity, customer_id, sku]);
            console.log("Handle Alter Quantity Cart Successful");
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
exports.handleAlterQuantCart = handleAlterQuantCart;
// export const handleAlterSKUCart = async (
//   customer_id: number,
//   sku: string,
//   new_sku: string,
//   product_id: number
// ): Promise<any> => {
//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();
//   //new product variation has changed.
//   const sql = `UPDATE cart SET sku = ? WHERE customer_id = ? AND sku = ? AND product_id = ?`;
//   try {
//     const result = await connection.query(sql, [
//       new_sku,
//       customer_id,
//       sku,
//       product_id,
//     ]);
//     console.log(result);
//     return result;
//   } catch (err: any) {
//     throw new Error(err);
//   } finally {
//     await connection.release();
//   }
// };
const handleInsertPayment = async (customer_id, amount) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO payment (customer_id, amount) VALUES (?,?)`;
    try {
        const [result] = await connection.query(sql, [customer_id, amount]);
        console.log("Handle Insert Payment Successful");
        return result.insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleInsertPayment = handleInsertPayment;
const handleInsertOrder = async (customer_id, payment_id, discount_applied, coins_redeemed, address_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO orders (customer_id, payment_id, discount_applied, coins_redeemed, address_id) VALUES (?,?,?,?,?)`;
    try {
        const [result] = await connection.query(sql, [
            customer_id,
            payment_id,
            discount_applied,
            coins_redeemed,
            address_id,
        ]);
        console.log("Handle Insert Order Successful");
        return result.insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleInsertOrder = handleInsertOrder;
const handleInsertOrderProduct = async (sku, orders_id, product_id, totalPrice, quantity) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO orders_product (sku, orders_id, product_id, total_price, quantity) VALUES (?,?,?,?,?)`;
    try {
        const [result] = await connection.query(sql, [
            sku,
            orders_id,
            product_id,
            totalPrice,
            quantity,
        ]);
        console.log("Handle Insert Order Product Successful");
        return result.insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleInsertOrderProduct = handleInsertOrderProduct;
const handleUpdateProductStock = async (quantityDeduct, sku) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE product_variations SET quantity = quantity - ? WHERE sku = ?;`;
    try {
        const result = await connection.query(sql, [quantityDeduct, sku]);
        console.log("Handle Updated Stock Successful ");
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleUpdateProductStock = handleUpdateProductStock;
const handleAlterCustomerCoins = async (customer_id, coins) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET coins = (coins + ?) WHERE customer_id = ?; `;
    try {
        const result = await connection.query(sql, [coins, customer_id]);
        console.log("Handle Alter Customer Coins Successful ");
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleAlterCustomerCoins = handleAlterCustomerCoins;
const handleInsertShipment = async (orders_product_id, customer_id) => {
    const promisePool = database_1.default.promise();
    console.log("entered handle insert shipment");
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO shipment (orders_product_id, customer_id) VALUES (?,?) `;
    try {
        const [result] = await connection.query(sql, [
            orders_product_id,
            customer_id,
        ]);
        console.log("Handle Insert Shipment Successful ");
        return result.insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleInsertShipment = handleInsertShipment;
const handleClearCart = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `DELETE FROM cart WHERE customer_id = ? `;
    try {
        const [result] = await connection.query(sql, [customer_id]);
        console.log("Handle Clear Cart Successful ");
        return result.affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleClearCart = handleClearCart;
// NHAT TIEN :D
const handlesInsertCart = async (quantity, customerId, productId, SKU) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO cart (quantity, customer_id, product_id, SKU) VALUES (?, ?, ?, ?);`;
    try {
        const [result] = await connection.query(sql, [
            quantity,
            customerId,
            productId,
            SKU,
        ]);
        return result.insertId;
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            console.log("entered update");
            const sql = `UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ? AND SKU = ?;`;
            try {
                const [result] = await connection.query(sql, [
                    quantity,
                    customerId,
                    productId,
                    SKU,
                ]);
                return result.insertId;
            }
            catch (err) {
                throw new Error(err);
            }
        }
    }
    finally {
        await connection.release();
    }
};
exports.handlesInsertCart = handlesInsertCart;
//# sourceMappingURL=cart.model.js.map