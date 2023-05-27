import pool from "../../config/database";

export const handleGetCustomerOrders = async (
  customer_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
    SELECT orders.orders_id, listed_products.seller_id, products.description, products.name, product_variations.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    orders.orders_date, product_images.image_url FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        JOIN product_images ON orders_product.sku = product_images.sku
        JOIN listed_products ON orders_product.product_id = listed_products.product_id 
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders WHERE orders.customer_id = ?
        ) AND orders_product.shipment_id IS NULL
    `;
  try {
    const result = await connection.query(sql, [customer_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetCustomerDeliveredOrders = async (
  customer_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
    SELECT listed_products.seller_id, orders_product.orders_id, products.description, products.name, product_variations.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    shipment.shipment_created, orders_product.orders_product_id, product_images.image_url FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
        JOIN product_images ON orders_product.sku = product_images.sku
        JOIN listed_products ON orders_product.product_id = listed_products.product_id
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders
                JOIN orders_product ON orders.orders_id = orders_product.orders_id 
                JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
                WHERE orders.customer_id = ? AND shipment.shipment_delivered IS NULL
        ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NULL
    `;
  try {
    const result = await connection.query(sql, [customer_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleGetCustomerReceivedOrders = async (
  customer_id: number
): Promise<Object[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
    SELECT listed_products.seller_id, orders_product.orders_id, products.description, products.name, product_variations.price, products.product_id, product_variations.variation_1, product_variations.variation_2, orders_product.quantity, orders_product.sku,
    shipment.shipment_delivered,shipment.orders_product_id, product_images.image_url FROM orders
        JOIN orders_product ON orders.orders_id = orders_product.orders_id
        JOIN products ON orders_product.product_id = products.product_id
        JOIN product_variations ON orders_product.sku = product_variations.sku
        JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
        JOIN product_images ON orders_product.sku = product_images.sku
        JOIN listed_products ON orders_product.product_id = listed_products.product_id
        WHERE orders_product.orders_id in (
            SELECT orders.orders_id FROM orders
                JOIN orders_product ON orders.orders_id = orders_product.orders_id 
                JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
                WHERE shipment.shipment_delivered IS NOT NULL AND orders.customer_id = ?
        ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NOT NULL
        ORDER BY shipment.orders_product_id
    `;
  try {
    const result = await connection.query(sql, [customer_id]);
    return result[0] as Object[];
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handleOrderReceived = async (
  orders_id: number,
  seller_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `
    UPDATE shipment
    JOIN orders_product ON shipment.shipment_id = orders_product.shipment_id
    JOIN listed_products ON orders_product.product_id = listed_products.product_id
    SET shipment.shipment_delivered = UTC_TIMESTAMP()
    WHERE orders_id = ? AND seller_id = ?
    `;
  try {
    const result = await connection.query(sql, [
      orders_id,
      seller_id,
    ]);
    return (result[0] as any).insertId as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
