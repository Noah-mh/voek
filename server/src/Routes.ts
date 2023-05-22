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
  router.put(
    "/customer/logout",
    verifyJWT,
    verifyRoles("customer"),
    customerController.processLogout
  );
  router.put(
    "/customer/seller",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processLogout
  );
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
  router.put(
    "/customer/received/:orders_id/:seller_id",
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
  router.get(
    "/seller/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processGetSellerDetails
  );
  router.put(
    "/seller/profile/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.processUpdateSellerDetails
  );
  router.put("/seller/email/verify", sellerController.processChangeEmail);
  router.put("/customer/email/verify", customerController.processChangeEmail);
  router.put(
    "/customer/deactivate/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.deactivateAccount
  );
  router.put(
    "/seller/deactivate/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.deactivateAccount
  );
  router.get(
    "/customer/status/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.getCustomerStatus
  );
  router.get(
    "/seller/status/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.getSellerStatus
  );
  router.put(
    "/seller/activate/:seller_id",
    verifyJWT,
    verifyRoles("seller"),
    sellerController.activateAccount
  );
  router.put(
    "/customer/activate/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.activateAccount
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
    verifyJWT,
    verifyRoles("customer"),
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

  router.delete(
    "/deleteReview",
    verifyJWT,
    verifyRoles("customer"),
    reviewController.deleteReview
  );
  router.get(
    "/customer/profile/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.getCustomerDetails
  );

  router.put(
    "/customer/profile/edit/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.updateCustomerDetails
  );

  router.put(
    "/customer/profile/edit/photo/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.updateCustomerPhoto
  );

  // ASHLEY ENDPOINTS - seller platform
  router.get(
    "/products/:sellerId",
    sellerController.processGetAllProductsOfSeller
  );
  router.get("/categories", sellerController.processGetAllCategories);
  router.post("/addProduct/:sellerId", sellerController.processAddProduct);
  // router.put(
  //   "/editProduct/:productId",
  //   sellerController.processEditProduct
  // )

  // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
  router.post(
    "/getWishlistItems",
    verifyJWT,
    verifyRoles("customer"),
    productController.getWishlistItems
  );

  router.get(
    "/getLastViewedProductExistence",
    verifyJWT,
    verifyRoles("customer"),
    productController.getLastViewedProductExistence
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

  router.post(
    "/insertLastViewedProduct",
    verifyJWT,
    verifyRoles("customer"),
    productController.insertLastViewedProduct
  );
  router.get(
    "/customer/getCart/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    cartController.retrieveCartDetails
  );

  router.get("/getProductCat/:product_id", productController.getProductCat);

  router.put(
    "/updateCustomerLastViewedCat",
    verifyJWT,
    verifyRoles("customer"),
    customerController.updateCustomerLastViewedCat
  );

  router.get(
    "/getCustomerLastViewedCat/:customer_id",
    customerController.getCustomerLastViewedCat
  );
  router.post(
    "/customer/getCart",
    verifyJWT,
    verifyRoles("customer"),
    cartController.retrieveCartDetails
  );
  router.post(
    "/customer/alterQuantCart",
    verifyJWT,
    verifyRoles("customer"),
    cartController.alterQuantCartDetails
  );
  router.post(
    "/customer/insertPayment",
    verifyJWT,
    verifyRoles("customer"),
    cartController.insertPayment
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
  router.post(
    "/customer/clearCart",
    verifyJWT,
    verifyRoles("customer"),
    cartController.clearCart
  );
  router.get(
    "/customer/getUserCoins/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.processGetCoins
  );
  router.get(
    "/customer/getUserAddress/:customer_id",
    verifyJWT,
    verifyRoles("customer"),
    customerController.processGetAddress
  );
}
