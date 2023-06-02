
import * as dotenv from 'dotenv';
dotenv.config({
  path: __dirname + '../../env'
});


const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://voek.netlify.app",
  "https://ades-voek-client.onrender.com",
  "https://piggetro-voek.netlify.app",
  "https://voek-allison.netlify.app",
  "https://ashleyteo404-ades-ca1.netlify.app",
  "https://voek-nhattien.netlify.app",
  process.env.FRONTEND_BASE_URL,
];
export default allowedOrigins;
