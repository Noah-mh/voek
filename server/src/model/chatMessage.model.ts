import pool from "../../config/database";
import { RowDataPacket, OkPacket } from "mysql2";
import * as dmRoomModel from "./dmRoom.model";

interface ChatMessage {
  cmID: string;
  roomID: string;
  senderID: string;
  text: string;
  image: string;
  status: string;
  dateCreated: string;
}

export const getRoomMessages = async (
  roomID: string,
  timezone: string
): Promise<ChatMessage[] | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT cm_id as cmID, room_id as roomID, sender_id as senderID, text, image, status, CONVERT_TZ(date_created, '+00:00', ?) as dateCreated 
      FROM chat_message
       WHERE room_id = ? ORDER BY dateCreated;`;
  const values = [timezone, roomID];
  try {
    const results = await connection.query<RowDataPacket[]>(sql, values);
    if (results[0].length === 0) return null;
    const room: ChatMessage[] = results[0] as ChatMessage[];
    return room;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const createMessage = async (
  roomID: string,
  senderID: string,
  role: string,
  text: string | null,
  image: string | null
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql =
    "INSERT INTO chat_message (room_id, sender_id, sender_role, text, image, status) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [roomID, senderID, role, text, image, 0];
  try {
    let results = await connection.query<OkPacket>(sql, values);
    let resultsForUpdate = 0;
    if (results[0].affectedRows === 1) {
      resultsForUpdate = await dmRoomModel.updateLastUpdated(roomID);
      return resultsForUpdate;
    }
    return results[0].affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const getUserUnreadMessages = async (
  roomID: string,
  senderID: string
): Promise<ChatMessage[] | null> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT cm_id as cmID, room_id as roomID, sender_id as senderID, text, image, status, date_created as dateCreated 
      FROM chat_message
       WHERE room_id = ? AND sender_id = ? AND status = 0;`;
  const values = [roomID, senderID];
  try {
    const results = await connection.query<RowDataPacket[]>(sql, values);
    if (results[0].length === 0) return null;
    const room: ChatMessage[] = results[0] as ChatMessage[];
    return room;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

export const updateMessagesStatus = async (
  roomID: string,
  senderID: string
): Promise<number> => {
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `UPDATE chat_message SET status = 1 WHERE room_id = ? AND sender_id = ?;`;
  const values = [roomID, senderID];
  try {
    const results = await connection.query<OkPacket>(sql, values);
    return results[0].affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
