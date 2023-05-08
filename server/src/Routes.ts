import { Express, Request, Response } from "express";
import { processLogin } from "./controller/user.controller";

export default function (app: Express) {
    app.post('/login', processLogin);
}