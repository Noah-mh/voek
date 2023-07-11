import pool from "../../config/database";
import { RowDataPacket, OkPacket } from "mysql2";

interface DMRoom {
  roomID: string;
  customerID: string;
  sellerID: string;
  dateCreated: Date;
}

export const getCustomerRooms = async (userID: string): Promise<DMRoom[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "SELECT * FROM dm_room WHERE customer_id = ?";
  const values = [userID, userID];
  try {
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    if (rows.length === 0) return [];
    const rooms: DMRoom[] = rows as DMRoom[];
    return rooms;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const getSellerRooms = async (userID: string): Promise<DMRoom[]> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "SELECT * FROM dm_room WHERE seller_id = ?";
  const values = [userID, userID];
  try {
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    if (rows.length === 0) return [];
    const rooms: DMRoom[] = rows as DMRoom[];
    return rooms;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const getDMRoom = async (
  customerID: string,
  sellerID: string
): Promise<DMRoom | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = "SELECT * FROM dm_room WHERE customer_id = ? AND seller_id = ?";
  const values = [customerID, sellerID, customerID, sellerID];
  try {
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    if (rows.length === 0) return null;
    const room: DMRoom = rows[0] as DMRoom;
    return room;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const createDMRoom = async (
  customerID: string,
  sellerID: string
): Promise<number> => {
  console.log("customerID: ", customerID);
  console.log("sellerID: ", sellerID);
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const existingRoom = await getDMRoom(customerID, sellerID);
  if (existingRoom) return 409;
  const sql = "INSERT INTO dm_room (customer_id, seller_id) VALUES (?, ?);";
  const values = [customerID, sellerID];
  try {
    console.log("values: ", values);
    const [rows] = await connection.query<OkPacket>(sql, values);
    console.log("rows: ", rows);
    return rows.affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
