import pool from "../../config/database";
import { RowDataPacket, OkPacket } from "mysql2";

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
  console.log("roomID: ", roomID);
  console.log("timezone: ", timezone);
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  const sql = `SELECT cm_id as cmID, room_id as roomID, sender_id as senderID, text, image, status, CONVERT_TZ(date_created, '+00:00', ?) as dateCreated 
      FROM chat_message
       WHERE room_id = ? ORDER BY dateCreated;`;
  const values = [timezone, roomID];
  try {
    const results = await connection.query<RowDataPacket[]>(sql, values);
    console.log("results actual: ", results);
    console.log("results: ", results[0]);
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
  console.log("text: ", text);
  console.log("image: ", image);
  const sql =
    "INSERT INTO chat_message (room_id, sender_id, sender_role, text, image, status) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [roomID, senderID, role, text, image, 0];
  try {
    const results = await connection.query<OkPacket>(sql, values);
    return results[0].affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
