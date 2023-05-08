import pool from '../../config/database';
import bycrpt from 'bcrypt';

export const handleLogin = async (email: string, password: string) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT username, password, customer_id, password FROM customer WHERE email = ?`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : '';
        const check = await bycrpt.compare(password, encryptrdPassword);
        if (check) {
            const customer_id: number = result[0][0]?.customer_id as number;
            const username: string = result[0][0]?.username;
            return { customer_id, username };
        }
        return null;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}

export const handleStoreRefreshToken = async (refreshtoken: string, customer_id: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE customer SET refresh_token =? WHERE customer_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, customer_id]);
        return result[0].affectedRows;
    } catch (err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}