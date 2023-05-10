import { Express, Router } from "express";
import { processLogin, processSendEmailOTP, processSendSMSOTP, processVerifyOTP, processSignUp, processSendEmailLink, processSignUpLink } from "./controller/customer.controller";
import verifyJWT from "./middlewares/verifyJwt";
import verifyRoles from "./middlewares/verifyRoles";
import {
  processPublicProductDetails,
  processCartDetails,
  getRecommendedProductsBasedOnCat,
  getWishlistItems,
  getLastViewed
} from "./controller/product.controller";
import { processRefreshToken } from "./controller/auth.controller";

export default function (app: Express, router: Router) {

  // KANG RUI ENDPOINTS
  router.post('/login', processLogin);
  router.post('/auth/SMS/OTP', processSendSMSOTP);
  router.post('/auth/email/OTP', processSendEmailOTP);
  router.post('/auth/verify/OTP', processVerifyOTP);
  router.post('/signup/link', processSendEmailLink);
  router.post('/signup/verify/link', processSignUpLink);
  router.post('/signup', processSignUp);
  router.post('/refresh', processRefreshToken)
  //
  router.get("/getRecommendedProductsBasedOnCat", getRecommendedProductsBasedOnCat);
  router.get("/getWishlistItems", getWishlistItems);
  router.get("/getLastViewed", getLastViewed);

  router.get("/productDetails", processPublicProductDetails);
  router.get("/cartDetails",verifyJWT,verifyRoles("customer"), processCartDetails);
}

