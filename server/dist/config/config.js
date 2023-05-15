"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
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
    ssl: {
        rejectUnauthorized: false,
    },
};
exports.default = config;
//
//# sourceMappingURL=config.js.map