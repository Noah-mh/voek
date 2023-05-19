import { addingReview } from "./controller/review.controller";
import { Express, Router } from "express";
import verifyJWT from "./middlewares/verifyJWT";
import verifyRoles from "./middlewares/verifyRoles";
import * as customerController from "./controller/customer.controller";
import * as productController from "./controller/product.controller";
import * as authController from "./controller/auth.controller";
import * as sellerController from "./controller/seller.controller";
import * as cartController from "./controller/cart.controller";
import * as orderController from "./controller/order.controller";
import * as paypalController from "./controller/paypal.controller";
import * as reviewController from "./controller/review.controller";

export default function (app: Express, router: Router) {
  // KANG RUI ENDPOINTS - user management system
  router.post("/login", customerController.processLogin);
  router.post("/customer/auth/SMS/OTP", customerController.processSendSMSOTP);
  router.post(
    "/customer/auth/email/OTP",
    customerController.processSendEmailOTP
  );
  router.post("/customer/auth/verify/OTP", customerController.processVerifyOTP);
  router.post(
    "/customer/signup/link/:referral_id",
    customerController.processSendEmailLink
  );
  router.post(
    "/customer/signup/verify/link",
    customerController.processSignUpLink
  );
  router.get("/refresh/customer", authController.processRefreshTokenCustomer);
  router.post(
    "/customer/forget/password",
    customerController.processForgetPassword
  );
  router.post(
    "/customer/verify/reset/password",
    customerController.processForgetPasswordLink
  );
  router.post(
    "/customer/reset/password",
    customerController.processResetPassword
  );

  router.post("/login/seller", sellerController.processLogin);
  router.post("/seller/auth/SMS/OTP", sellerController.processSendSMSOTP);
  router.post("/seller/auth/email/OTP", sellerController.processSendEmailOTP);
  router.post("/seller/auth/verify/OTP", sellerController.processVerifyOTP);
  router.post("/seller/signup/link", sellerController.processSendEmailLink);
  router.post("/seller/signup/verify/link", sellerController.processSignUpLink);
  router.get("/refresh/seller", authController.processRefreshSeller);
  router.post(
    "/seller/forget/password",
    sellerController.processForgetPassword
  );
  router.post(
    "/seller/verify/reset/password",
    sellerController.processForgetPasswordLink
  );
  router.post("/seller/reset/password", sellerController.processResetPassword);
  router.get(
    "/customer/orders/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    orderController.processHandleGetCustomerOrders
  );
  router.get(
    "/customer/delivered/orders/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    orderController.processhandleGetCustomerDeliveredOrders
  );
  router.get(
    "/customer/received/orders/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    orderController.processGetCustomerReceivedOrders
  );
  router.get(
    "/customer/received/:orders_product_id",
    verifyJWT,
    verifyRoles("customer"),
    orderController.processOrderReceived
  );
  router.post(
    "/create-paypal-order",
    verifyJWT,
    verifyRoles("customer"),
    paypalController.processCreatePaypalOrder
  );
  router.post(
    "/capture-paypal-order",
    verifyJWT,
    verifyRoles("customer"),
    paypalController.processCapturePaypalOrder
  );
  router.get(
    "/customer/referral-id/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.processGetReferralId
  );
  router.get(
    "/seller/orders/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processGetSellerOrders
  );
  router.get(
    "/seller/orders/shipped/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processGetSellerShipped
  );
  router.get(
    "/seller/orders/delivered/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processGetSellerDelivered
  );
  router.put(
    "/seller/orders/shipped",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processPackedAndShipped
  );
  router.get(
    "/seller/customer/:orders_id/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processGetCustomerOrders
  );

  // NOAH ENDPOINTS - reviews
  router.get(
    "/productDetailsWithoutReviews/:product_id",
    productController.getProductDetailsWithoutReviews
  );
  router.get(
    "/productReviews/:product_id",
    productController.getProductReviews
  );
  router.post(
    "/addToCart",
    // verifyJWT,
    // verifyRoles("customer"),
    productController.addToCart
  );
  router.post(
    "/addReview",
    verifyJWT,
    verifyRoles("customer"),
    reviewController.addingReview
  );
  router.post(
    "/addReviewImages",
    verifyJWT,
    verifyRoles("customer"),
    reviewController.addingReviewImages
  );

  // ASHLEY ENDPOINTS - seller platform
  router.get(
    "/products/:sellerId",
    sellerController.processGetAllProductsOfSeller
  );
  router.get("/orders/:ordersId", sellerController.processGetOrderDetails);

  // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
  router.post(
    "/getWishlistItems",
    verifyJWT,
    verifyRoles("customer"),
    productController.getWishlistItems
  );
  router.post(
    "/getLastViewed",
    verifyJWT,
    verifyRoles("customer"),
    productController.getLastViewed
  );
  router.post("/productDetails", productController.processPublicProductDetails);

  router.get(
    "/getRecommendedProductsBasedOnCat/:category_id",
    productController.getRecommendedProductsBasedOnCat
  );

  router.get(
    "/getRecommendedProductsBasedOnCatWishlist/:category_id",
    verifyJWT,
    verifyRoles("customer"),
    productController.getRecommendedProductsBasedOnCatWishlist
  );

  router.get(
    "/getProductsUsingCategory/:category_id",
    productController.getProductsUsingCategory
  );

  router.get(
    "/cartDetails",
    verifyJWT,
    verifyRoles("customer"),
    cartController.retrieveCartDetails
  );
  router.get("/topProducts", productController.getTopProducts);
  router.get(
    "/searchBarPredictions",
    productController.getSearchBarPredictions
  );
  router.post("/searchResult", productController.getSearchResult);
  router.get(
    "/productsBasedOnCategory",
    productController.getProductsBasedOnCategory
  );
  router.post(
    "/insertWishlistedProduct",
    verifyJWT,
    verifyRoles("customer"),
    productController.insertWishlistedProduct
  );
  router.delete(
    "/deleteWishlistedProduct",
    verifyJWT,
    verifyRoles("customer"),
    productController.deleteWishlistedProduct
  );
  router.post(
    "/checkWishlistProductExistence",
    verifyJWT,
    verifyRoles("customer"),
    productController.checkWishListProductExistence
  );
  router.get("/getAllListedProducts", productController.getAllListedProducts);
  router.get(
    "/getProductVariations/:product_Id",
    productController.getProductVariations
  );

  router.get(
    "/getProductVariationsPricing/:product_Id",
    productController.getProductVariationsPricing
  );

  router.get("/getProductImage/:product_Id", productController.getProductImage);

  router.get(
    "/getProductVariationImage/:sku",
    productController.getProductVariationImage
  );

  router.post("/insertCart", cartController.insertCart);

  router.get(
    "/customer/getCart/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    cartController.retrieveCartDetails
  );
  router.get("/getProductCat/:product_id", productController.getProductCat);

  router.put(
    "/updateCustomerLastViewedCat",
    // verifyJWT,
    // verifyRoles("customer"),
    customerController.updateCustomerLastViewedCat
  );
  router.post(
    "/customer/alterQuantCart",
    verifyJWT,
    verifyRoles("customer"),
    cartController.alterQuantCartDetails
  );
  router.post(
    "/customer/insertOrder",
    verifyJWT,
    verifyRoles("customer"),
    cartController.insertOrder
  );
  router.post(
    "/customer/insertOrderProduct",
    verifyJWT,
    verifyRoles("customer"),
    cartController.insertOrderProduct
  );
  router.post(
    "/customer/updateProductStock",
    verifyJWT,
    verifyRoles("customer"),
    cartController.updateProductStock
  );
  router.post(
    "/customer/updateCustomerCoins",
    verifyJWT,
    verifyRoles("customer"),
    cartController.updateCustomerCoins
  );
  router.post(
    "/customer/insertShipment",
    verifyJWT,
    verifyRoles("customer"),
    cartController.insertShipment
  );
  router.get(
    "/customer/getUserCoins/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.processGetCoins
  );
  router.get(
    "/customer/getUserAddress/:customer_id",
    //verifyJWT,
    // verifyRoles("customer"),
    customerController.processGetAddress
  );
}
