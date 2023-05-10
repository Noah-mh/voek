import { Express, Router } from "express";
import verifyJWT from "./middlewares/verifyJWT";
import verifyRoles from "./middlewares/verifyRoles";
import * as customerController from "./controller/customer.controller";
import * as productController from "./controller/product.controller";
import * as sellerController from "./controller/seller.controller";
import * as cartController from "./controller/cart.controller";
import { processRefreshTokenCustomer } from "./controller/auth.controller";
import { processGetAllProductsOfSeller } from "./controller/seller.controller";
import { retrieveCartDetails } from "./controller/cart.controller";

export default function (app: Express, router: Router) {
  // KANG RUI ENDPOINTS - user management system
  router.post("/login", customerController.processLogin);
  router.post("/customer/auth/SMS/OTP", customerController.processSendSMSOTP);
  router.post(
    "/customer/auth/email/OTP",
    customerController.processSendEmailOTP
  );
  router.post("/customer/auth/verify/OTP", customerController.processVerifyOTP);
  router.post("/customer/signup/link", customerController.processSendEmailLink);
  router.post(
    "/customer/signup/verify/link",
    customerController.processSignUpLink
  );
  router.post("/customer/signup", customerController.processSignUp);

  router.post("/login/seller", sellerController.processLogin);
  router.post("/seller/auth/SMS/OTP", sellerController.processSendSMSOTP);
  router.post("/seller/auth/email/OTP", sellerController.processSendEmailOTP);
  router.post("/seller/auth/verify/OTP", sellerController.processVerifyOTP);
  router.post("/seller/signup/link", sellerController.processSendEmailLink);
  router.post("/seller/signup/verify/link", sellerController.processSignUpLink);
  router.post("/seller/signup", sellerController.processSignUp);
  router.post("/refresh/customer", processRefreshTokenCustomer);
  router.post("/refresh/seller", processRefreshTokenCustomer);

  // ASHLEY ENDPOINTS - seller platform
  router.get("/products/:sellerId", processGetAllProductsOfSeller);
  router.get(
    "/getRecommendedProductsBasedOnCat",
    productController.getRecommendedProductsBasedOnCat
  );

  // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
  router.get("/getWishlistItems", productController.getWishlistItems);
  router.get("/getLastViewed", productController.getLastViewed);
  router.get("/productDetails", productController.processPublicProductDetails);
  router.get("/topProducts", productController.getTopProducts);
  router.get("/searchBarPredictions", productController.getSearchBarPredictions);
  router.get("/searchResult", productController.getSearchResult);
  router.get("/productsBasedOnCategory", productController.getProductsBasedOnCategory);
  router.post("/insertWishlistedProduct", productController.insertWishlistedProduct);
  router.put("/updateCustLastViewedCat", customerController.updateCustLastViewedCat);
  router.delete("/deleteWishlistedProduct", productController.deleteWishlistedProduct);

  //ALLISON'S ENDPOINTS - CART

  // router.get(
  //   "/cartDetails",
  //   verifyJWT,
  //   verifyRoles("customer"),
  //   cartController.retrieveCartDetails
  // );

  router.post("/getCart", cartController.retrieveCartDetails);
  router.post("/alterCart", cartController.alterCartDetails);
}
