import { connect } from 'http2';
import pool from '../../config/database';

export const handleRefreshTokenCustomer = async (refreshToken: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT customer_id FROM customer WHERE refresh_token = ?`;
    try {  
        const result = await connection.query(sql, [refreshToken]);
        return result[0];
    } catch(err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}