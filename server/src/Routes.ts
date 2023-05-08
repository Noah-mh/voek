import { Express, Request, Response } from "express";
import { processLogin, processSendSMSOTP } from "./controller/customer.controller";

export default function (app: Express) {
    app.post('/login', processLogin);
    app.post('/test', processSendSMSOTP);
}