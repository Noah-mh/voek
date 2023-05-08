import { Express, Request, Response } from "express";
import { processLogin } from "./controller/user.controller";
import {
  processPublicProductDetails,
  processCartDetails,
} from "./controller/product.controller";
export default function (app: Express) {
  app.post("/login", processLogin);
  app.get("/productDetails", processPublicProductDetails);
  app.get("/cartDetails", processCartDetails);
}
