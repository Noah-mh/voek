import pool from '../../config/database';

export const handleGetCustomerOrders = async (customer_id: number): Promise<Object[]> => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    const sql = `
    SELECT x.product_id, products.name, products.description, products.price, product_variations.variation_1, product_variations.variation_2, x.quantity, x.sku, orders.orders_date
    FROM orders_product x
    JOIN orders ON orders.orders_id = x.orders_id
    JOIN products ON x.product_id = products.product_id
    JOIN product_variations ON x.sku = product_variations.sku
    WHERE x.orders_id IN (
      SELECT orders_id
      FROM orders
      WHERE customer_id = 30 AND shipment_id IS NULL
    ) AND products.active != 0
     
    `
    try {
        const result = await connection.query(sql, [customer_id]);
        return result[0] as Object[];
    } catch (err: any) {
        throw new Error(err);
    }
}