
import * as dotenv from 'dotenv';
dotenv.config({
  path: __dirname + '../../env'
});


const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://main--voek.netlify.app",
  "https://ades-voek-client.onrender.com",
  process.env.FRONTEND_BASE_URL,
];
export default allowedOrigins;
