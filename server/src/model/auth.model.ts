import pool from '../../config/database';

export const handleRefreshTokenCustomer = async (refreshToken: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT customer_id, username FROM customer WHERE refresh_token = ?`;
    try {  
        const result = await connection.query(sql, [refreshToken]);
        return result[0];
    } catch(err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleRefreshTokenSeller = async (refreshToken: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT seller_id, shop_name FROM seller WHERE refresh_token = ?`;
    try {  
        const result = await connection.query(sql, [refreshToken]);
        return result[0];
    } catch(err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}