"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderReceived = exports.handleGetCustomerReceivedOrders = exports.handleGetCustomerDeliveredOrders = exports.handleGetCustomerOrders = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handleGetCustomerOrders = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    SELECT products.description, products.name, products.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    orders.orders_date FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders WHERE orders.customer_id = 30
        ) AND orders_product.shipment_id IS NULL
    `;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerOrders = handleGetCustomerOrders;
const handleGetCustomerDeliveredOrders = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    SELECT products.description, products.name, products.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    shipment.shipment_created, orders_product.orders_product_id FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders
                JOIN orders_product ON orders.orders_id = orders_product.orders_id 
                JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
                WHERE orders.customer_id = 30 AND shipment.shipment_delivered IS NULL
        ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NULL
    `;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerDeliveredOrders = handleGetCustomerDeliveredOrders;
const handleGetCustomerReceivedOrders = async (customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    SELECT products.description, products.name, products.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    shipment.shipment_delivered FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders
                JOIN orders_product ON orders.orders_id = orders_product.orders_id 
                JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
                WHERE shipment.shipment_delivered IS NOT NULL AND orders.customer_id = 30
        ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NOT NULL
    `;
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerReceivedOrders = handleGetCustomerReceivedOrders;
const handleOrderReceived = async (orders_product_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE shipment SET shipment_delivered = utc_timestamp() WHERE orders_product_id = ?`;
    try {
        const result = await connection.query(sql, [orders_product_id]);
        return result[0].insertId;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleOrderReceived = handleOrderReceived;
//# sourceMappingURL=order.model.js.map