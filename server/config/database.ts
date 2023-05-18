import mysql2 from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();


const pool = mysql2.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT as unknown as number,
    ssl: {
        rejectUnauthorized: false,
    },
    dateStrings: true
})

export default pool
//