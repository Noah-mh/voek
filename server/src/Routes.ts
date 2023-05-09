import { Express, Request, Response } from "express";
import { processLogin, processSendEmailOTP, processSendSMSOTP, processVerifyOTP } from "./controller/customer.controller";

import {
  processPublicProductDetails,
  processCartDetails,
  getRecommendedProductsBasedOnCat,
  getWishlistItems,
  getLastViewed
} from "./controller/product.controller";


export default function (app: Express) {
    app.post('/login', processLogin);
    app.post('/auth/SMS/OTP', processSendSMSOTP);
    app.post('/auth/email/OTP', processSendEmailOTP);

    app.post('/auth/verify/OTP', processVerifyOTP);

    app.get("/productDetails", processPublicProductDetails);
    app.get("/cartDetails", processCartDetails);
    app.get("/getRecommendedProductsBasedOnCat", getRecommendedProductsBasedOnCat);
    app.get("/getWishlistItems", getWishlistItems);
    app.get("/getLastViewed", getLastViewed);


}

//
