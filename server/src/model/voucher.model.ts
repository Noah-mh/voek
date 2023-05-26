import pool from "../../config/database";

export const handlesInsertingVoucher = async (
  name: string,
  seller_id: number,
  type: number,
  amount: number,
  voucher_category: number,
  min_spend: number,
  expiration_date: string,
  redemptions_available: number,
  active: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO seller_voucher 
  (voucher_name, seller_id, number_amount, percentage_amount, 
  voucher_category, min_spend, expiration_date, redemptions_available, active)
  VALUES (?, ?, ?, ?, ?, ?, CAST(? AS datetime), ?, ?);`;
  let percentage_amount = null;
  let number_amount = null;
  if (type === 1) {
    percentage_amount = amount;
  } else {
    number_amount = amount;
  }

  try {
    const result = await connection.query(sql, [
      name,
      seller_id,
      number_amount,
      percentage_amount,
      voucher_category,
      min_spend,
      expiration_date,
      redemptions_available,
      active,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetVoucherCategories = async () => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT c.voucher_category_id as categoryId, c.voucher_category as category FROM voucher_category c;`;
  try {
    const result = await connection.query(sql, []);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesGetVouchers = async (sellerId: number) => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT v.voucher_id as voucherId, v.voucher_name as name, v.number_amount as amount, (v.percentage_amount * 100) as percentage, 
  v.voucher_category as category, v.min_spend as minSpend, DATE(v.expiration_date) as expiryDate, 
  v.redemptions_available as redemptionsAvailable, v.active as active
  FROM seller_voucher v 
  WHERE seller_id = ?;`;
  try {
    const result = await connection.query(sql, [sellerId]);
    return result[0] as Array<Object>;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesUpdateRedemptionsAvailable = async (
  voucher_id: number,
  redemptions_available: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller_voucher SET redemptions_available = ? WHERE voucher_id = ?;`;
  try {
    const result = await connection.query(sql, [
      redemptions_available,
      voucher_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesUpdateVoucher = async (
  name: string,
  type: number,
  amount: number,
  voucher_category: number,
  min_spend: number,
  expiration_date: string,
  redemptions_available: number,
  active: number,
  voucher_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE seller_voucher 
  SET voucher_name = ?, number_amount = ?, percentage_amount = ?, voucher_category = ?, 
  min_spend = ?, expiration_date = CAST(? as datetime), redemptions_available = ?, active = ?
  WHERE voucher_id = ?;`;
  let percentage_amount = null;
  let number_amount = null;
  if (type === 1) {
    percentage_amount = amount;
  } else {
    number_amount = amount;
  }
  try {
    const result = await connection.query(sql, [
      name,
      number_amount,
      percentage_amount,
      voucher_category,
      min_spend,
      expiration_date,
      redemptions_available,
      active,
      voucher_id,
    ]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesDeleteSellerVoucher = async (
  voucher_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `DELETE FROM seller_voucher WHERE voucher_id = ?;`;
  try {
    const result = await connection.query(sql, [voucher_id]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};

export const handlesDeleteVoucher = async (
  voucher_id: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const deletedFromSeller = await handlesDeleteSellerVoucher(voucher_id);
  if (deletedFromSeller === 0) throw new Error("Voucher not found");
  const sql = `DELETE FROM customer_voucher WHERE voucher_id = ?;`;
  try {
    const result = await connection.query(sql, [voucher_id]);
    return (result[0] as any).affectedRows as number;
  } catch (err: any) {
    throw new Error(err);
  } finally {
    await connection.release();
  }
};
