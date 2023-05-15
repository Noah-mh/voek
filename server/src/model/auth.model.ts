import pool from '../../config/database';

interface CustomerData {
    customer_id: number;
    username: string;
  }
  
  interface SellerData {
    seller_id: number;
    shop_name: string;
  }
  

export const handleRefreshTokenCustomer = async (refreshToken: string): Promise<CustomerData[]> => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT customer_id, username FROM customer WHERE refresh_token = ?`;
    try {  
        const result = await connection.query(sql, [refreshToken]);
        return result[0] as CustomerData[];
    } catch(err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}


export const handleRefreshTokenSeller = async (refreshToken: string): Promise<SellerData[]> => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT seller_id, shop_name FROM seller WHERE refresh_token = ?`;
    try {  
        const result = await connection.query(sql, [refreshToken]);
        return result[0] as SellerData[];
    } catch(err: any) {
        throw new Error(err);
    } finally {
        await connection.release();
    }
}