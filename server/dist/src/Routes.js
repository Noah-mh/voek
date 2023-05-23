"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJWT_1 = __importDefault(require("./middlewares/verifyJWT"));
const verifyRoles_1 = __importDefault(require("./middlewares/verifyRoles"));
const customerController = __importStar(require("./controller/customer.controller"));
const productController = __importStar(require("./controller/product.controller"));
const authController = __importStar(require("./controller/auth.controller"));
const sellerController = __importStar(require("./controller/seller.controller"));
const cartController = __importStar(require("./controller/cart.controller"));
const orderController = __importStar(require("./controller/order.controller"));
const paypalController = __importStar(require("./controller/paypal.controller"));
const reviewController = __importStar(require("./controller/review.controller"));
function default_1(app, router) {
    // KANG RUI ENDPOINTS - user management system
    router.post("/login", customerController.processLogin);
    router.put("/customer/logout", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.processLogout);
    router.put("/customer/seller", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processLogout);
    router.post("/customer/auth/SMS/OTP", customerController.processSendSMSOTP);
    router.post("/customer/auth/email/OTP", customerController.processSendEmailOTP);
    router.post("/customer/auth/verify/OTP", customerController.processVerifyOTP);
    router.post("/customer/signup/link/:referral_id", customerController.processSendEmailLink);
    router.post("/customer/signup/verify/link", customerController.processSignUpLink);
    router.get("/refresh/customer", authController.processRefreshTokenCustomer);
    router.post("/customer/forget/password", customerController.processForgetPassword);
    router.post("/customer/verify/reset/password", customerController.processForgetPasswordLink);
    router.post("/customer/reset/password", customerController.processResetPassword);
    router.post("/login/seller", sellerController.processLogin);
    router.post("/seller/auth/SMS/OTP", sellerController.processSendSMSOTP);
    router.post("/seller/auth/email/OTP", sellerController.processSendEmailOTP);
    router.post("/seller/auth/verify/OTP", sellerController.processVerifyOTP);
    router.post("/seller/signup/link", sellerController.processSendEmailLink);
    router.post("/seller/signup/verify/link", sellerController.processSignUpLink);
    router.get("/refresh/seller", authController.processRefreshSeller);
    router.post("/seller/forget/password", sellerController.processForgetPassword);
    router.post("/seller/verify/reset/password", sellerController.processForgetPasswordLink);
    router.post("/seller/reset/password", sellerController.processResetPassword);
    router.get("/customer/orders/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), orderController.processHandleGetCustomerOrders);
    router.get("/customer/delivered/orders/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), orderController.processhandleGetCustomerDeliveredOrders);
    router.get("/customer/received/orders/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), orderController.processGetCustomerReceivedOrders);
    router.put("/customer/received/:orders_id/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), orderController.processOrderReceived);
    router.post("/create-paypal-order", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), paypalController.processCreatePaypalOrder);
    router.post("/capture-paypal-order", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), paypalController.processCapturePaypalOrder);
    router.get("/customer/referral-id/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.processGetReferralId);
    router.get("/seller/orders/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processGetSellerOrders);
    router.get("/seller/orders/shipped/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processGetSellerShipped);
    router.get("/seller/orders/delivered/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processGetSellerDelivered);
    router.put("/seller/orders/shipped", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processPackedAndShipped);
    router.get("/seller/customer/:orders_id/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processGetCustomerOrders);
    router.get("/seller/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processGetSellerDetails);
    router.put("/seller/profile/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.processUpdateSellerDetails);
    router.put("/seller/email/verify", sellerController.processChangeEmail);
    router.put("/customer/email/verify", customerController.processChangeEmail);
    router.put("/customer/deactivate/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.deactivateAccount);
    router.put("/seller/deactivate/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.deactivateAccount);
    router.get("/customer/status/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.getCustomerStatus);
    router.get("/seller/status/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.getSellerStatus);
    router.put("/seller/activate/:seller_id", verifyJWT_1.default, (0, verifyRoles_1.default)("seller"), sellerController.activateAccount);
    router.put("/customer/activate/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.activateAccount);
    // NOAH ENDPOINTS - reviews
    router.get("/productDetailsWithoutReviews/:product_id", productController.getProductDetailsWithoutReviews);
    router.get("/productReviews/:product_id", productController.getProductReviews);
    router.get("/getCartDetails/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.getCart);
    router.post("/addToCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.addToCart);
    router.post("/addReview", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), reviewController.addingReview);
    router.post("/addReviewImages", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), reviewController.addingReviewImages);
    router.delete("/deleteReview", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), reviewController.deleteReview);
    router.get("/customer/profile/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.getCustomerDetails);
    router.put("/customer/profile/edit/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.updateCustomerDetails);
    router.put("/customer/profile/edit/photo/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.updateCustomerPhoto);
    // ASHLEY ENDPOINTS - seller platform
    router.get("/products/:sellerId", sellerController.processGetAllProductsOfSeller);
    router.get("/categories", sellerController.processGetAllCategories);
    router.post("/addProduct/:sellerId", sellerController.processAddProduct);
    // router.put(
    //   "/editProduct/:productId",
    //   sellerController.processEditProduct
    // )
    // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
    router.post("/getWishlistItems", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.getWishlistItems);
    router.get("/getLastViewedProductExistence", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.getLastViewedProductExistence);
    router.post("/getLastViewed", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.getLastViewed);
    router.post("/productDetails", productController.processPublicProductDetails);
    router.get("/getRecommendedProductsBasedOnCat/:category_id", productController.getRecommendedProductsBasedOnCat);
    router.get("/getRecommendedProductsBasedOnCatWishlist/:category_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.getRecommendedProductsBasedOnCatWishlist);
    router.get("/getProductsUsingCategory/:category_id", productController.getProductsUsingCategory);
    router.get("/cartDetails", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.retrieveCartDetails);
    router.get("/topProducts", productController.getTopProducts);
    router.get("/searchBarPredictions", productController.getSearchBarPredictions);
    router.post("/searchResult", productController.getSearchResult);
    router.get("/productsBasedOnCategory", productController.getProductsBasedOnCategory);
    router.post("/insertWishlistedProduct", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.insertWishlistedProduct);
    router.delete("/deleteWishlistedProduct", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.deleteWishlistedProduct);
    router.post("/checkWishlistProductExistence", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.checkWishListProductExistence);
    router.get("/getAllListedProducts", productController.getAllListedProducts);
    router.get("/getProductVariations/:product_Id", productController.getProductVariations);
    router.get("/getProductVariationsPricing/:product_Id", productController.getProductVariationsPricing);
    router.get("/getProductImage/:product_Id", productController.getProductImage);
    router.get("/getProductVariationImage/:sku", productController.getProductVariationImage);
    router.post("/insertCart", cartController.insertCart);
    router.post("/insertLastViewedProduct", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), productController.insertLastViewedProduct);
    router.get("/customer/getCart/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.retrieveCartDetails);
    router.post("/insertLastViewedProduct", 
    // verifyJWT,
    // verifyRoles("customer"),
    productController.insertLastViewedProduct);
    router.get("/getProductCat/:product_id", productController.getProductCat);
    router.put("/updateCustomerLastViewedCat", 
    // verifyJWT,
    // verifyRoles("customer"),
    customerController.updateCustomerLastViewedCat);
    router.get("/getCustomerLastViewedCat/:customer_id", customerController.getCustomerLastViewedCat);
    router.post("/customer/getCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.retrieveCartDetails);
    router.post("/customer/alterQuantCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.alterQuantCartDetails);
    router.post("/customer/insertPayment", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.insertPayment);
    router.post("/customer/insertOrder", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.insertOrder);
    router.post("/customer/insertOrderProduct", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.insertOrderProduct);
    router.post("/customer/updateProductStock", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.updateProductStock);
    router.post("/customer/updateCustomerCoins", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.updateCustomerCoins);
    router.post("/customer/insertShipment", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.insertShipment);
    router.post("/customer/clearCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.clearCart);
    router.get("/customer/getUserCoins/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.processGetCoins);
    router.get("/customer/getUserAddress/:customer_id", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), customerController.processGetAddress);
}
exports.default = default_1;
//# sourceMappingURL=Routes.js.map