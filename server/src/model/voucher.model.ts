import pool from "../../config/database";

export const handlesInsertingVoucherAmount = async (
  name: string,
  seller_id: number,
  type: number,
  amount: number,
  voucher_category: number,
  min_spend: number,
  redemptions_available: number,
  active: number
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `INSERT INTO seller_voucher 
  (voucher_name, seller_id, number_amount, percentage_amount, 
  voucher_category, min_spend, expiration_date, redemptions_available, active)
  VALUES (?, ?, ?, ?, ?, ?, (SELECT UTC_TIMESTAMP() + INTERVAL 10 DAY AS new_timestamp), ?, ?);`;
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
