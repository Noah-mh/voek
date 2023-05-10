import { Express, Request, Response } from 'express'
import { processLogin, processSendEmailOTP, processSendSMSOTP } from "./controller/customer.controller";
import { processGetAllProductsOfSeller } from './controller/seller.controller'

export default function (app: Express) {
    // user management system
    app.post('/login', processLogin);
    app.post('/auth/SMS/OTP', processSendSMSOTP);
    app.post('/auth/email/OTP', processSendEmailOTP);

    // seller platform
    app.get('/products/:sellerId', processGetAllProductsOfSeller);
}