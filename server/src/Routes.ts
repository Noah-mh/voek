import { Express, Request, Response } from "express"
import { processLogin } from "./controller/user.controller";
import { publicProductDetails } from "./controller/product.controller";
export default function (app: Express) {
    app.post('/login', processLogin);
    app.get("/productDetails", publicProductDetails);
    }

