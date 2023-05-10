import { Express, Router } from "express";
import {
  processLogin,
  processSendEmailOTP,
  processSendSMSOTP,
  processVerifyOTP,
  processSignUp,
  processSendEmailLink,
  processSignUpLink,
  updateCustLastViewedCat,
} from "./controller/customer.controller";
import verifyJWT from "./middlewares/verifyJwt";
import verifyRoles from "./middlewares/verifyRoles";
import {
  processPublicProductDetails,
  getRecommendedProductsBasedOnCat,
  getWishlistItems,
  getLastViewed,
  getTopProducts,
} from "./controller/product.controller";
import { processRefreshToken } from "./controller/auth.controller";
import { processGetAllProductsOfSeller } from "./controller/seller.controller";
import {  retrieveCartDetails, } from "./controller/cart.controller";

export default function (app: Express, router: Router) {
  // KANG RUI ENDPOINTS - user management system
  router.post("/login", processLogin);
  router.post("/auth/SMS/OTP", processSendSMSOTP);
  router.post("/auth/email/OTP", processSendEmailOTP);
  router.post("/auth/verify/OTP", processVerifyOTP);
  router.post("/signup/link", processSendEmailLink);
  router.post("/signup/verify/link", processSignUpLink);
  router.post("/signup", processSignUp);
  router.post("/refresh", processRefreshToken);

  // ASHLEY ENDPOINTS - seller platform
  app.get("/products/:sellerId", processGetAllProductsOfSeller);

  //
  router.get(
    "/getRecommendedProductsBasedOnCat",
    getRecommendedProductsBasedOnCat
  );

  // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
  router.get("/getWishlistItems", getWishlistItems);
  router.get("/getLastViewed", getLastViewed);
  router.get("/productDetails", processPublicProductDetails);
  router.get("/getTopProducts", getTopProducts);
  router.get("/updateCustLastViewedCat", updateCustLastViewedCat);

  router.get("/cartDetails", retrieveCartDetails);
}
