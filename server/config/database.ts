import mysql2 from 'mysql2';
import config from './config';


const pool = mysql2.createPool({
    user: config.user,
    password: config.password,
    host: config.host,
    database: config.database,
    connectionLimit: config.connectionLimit as unknown as number,
    ssl: {
        rejectUnauthorized: false,
    }
})

export default pool
//