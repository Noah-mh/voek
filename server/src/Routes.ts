import { Express, Request, Response } from "express";
import { processLogin, processSendEmailOTP, processSendSMSOTP, processVerifyOTP } from "./controller/customer.controller";

export default function (app: Express) {
    app.post('/login', processLogin);
    app.post('/auth/SMS/OTP', processSendSMSOTP);
    app.post('/auth/email/OTP', processSendEmailOTP);
    app.post('/auth/OTP', processVerifyOTP);
}