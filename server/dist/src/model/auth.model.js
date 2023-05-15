"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRefreshTokenSeller = exports.handleRefreshTokenCustomer = void 0;
const database_1 = __importDefault(require("../../config/database"));
const handleRefreshTokenCustomer = async (refreshToken) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT customer_id, username FROM customer WHERE refresh_token = ?`;
    try {
        const result = await connection.query(sql, [refreshToken]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleRefreshTokenCustomer = handleRefreshTokenCustomer;
const handleRefreshTokenSeller = async (refreshToken) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT seller_id, shop_name FROM seller WHERE refresh_token = ?`;
    try {
        const result = await connection.query(sql, [refreshToken]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleRefreshTokenSeller = handleRefreshTokenSeller;
//# sourceMappingURL=auth.model.js.map