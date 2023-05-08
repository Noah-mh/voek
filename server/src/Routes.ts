import { Express, Request, Response } from "express";
import { publicProductDetails } from "./controller/product.controller";
export default function (app: Express) {
  app.get("/productDetails", publicProductDetails);
}
