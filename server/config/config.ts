import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  emailTokenSecret: process.env.EMAIL_TOKEN_SECRET,
  telesignAPIKey: process.env.TELESIGN_API_KEY,
  telesignCustomerId: process.env.TELESIGN_CUSTOMER_ID,
  sendInBlueAPIKey: process.env.SENDINBLUE_API_KEY,
  signUpCustomerTokenSecret: process.env.SIGNUP_CUSTOMER_TOKEN_SECRET,
  signUpSellerTokenSecret: process.env.SIGNUP_SELLER_TOKEN_SECRET,
  forgetPasswordCustomerTokenSecret: process.env.FORGETPASSWORD_CUSTOMER_TOKEN_SECRET,
  forgetPasswordSellerTokenSecret: process.env.FORGETPASSWORD_SELLER_TOKEN_SECRET,
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_APP_SECRET,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default config;
//
