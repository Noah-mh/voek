import pool from '../../config/database';

// GET all products from 1 seller
export const handleGetAllProducts = async (sellerId: number) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = 
    `SELECT p.name, p.description, p.price, p.image_url FROM products p 
    RIGHT OUTER JOIN listed_products lp ON lp.product_id = p.product_id 
    WHERE lp.seller_id = ?;`
    try {
        const result = await connection.query(sql, [sellerId]);
        return result[0];
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    } finally {
        await connection.release();
    }
}