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
    router.post("/customer/auth/SMS/OTP", customerController.processSendSMSOTP);
    router.post("/customer/auth/email/OTP", customerController.processSendEmailOTP);
    router.post("/customer/auth/verify/OTP", customerController.processVerifyOTP);
    router.post("/customer/signup/link", customerController.processSendEmailLink);
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
    router.get("/customer/orders/:customer_id", orderController.processHandleGetCustomerOrders);
    router.get("/customer/delivered/orders/:customer_id", orderController.processhandleGetCustomerDeliveredOrders);
    router.get("/customer/received/orders/:customer_id", orderController.processGetCustomerReceivedOrders);
    router.get('/customer/received/:orders_product_id', orderController.processOrderReceived);
    router.post('/create-paypal-order', paypalController.processCreatePaypalOrder);
    router.post('/capture-paypal-order', paypalController.processCapturePaypalOrder);
    router.get('/customer/referral-id/:customer_id', customerController.processGetReferralId);
    // NOAH ENDPOINTS - reviews
    router.get("/productDetailsWithoutReviews/:product_id", productController.getProductDetailsWithoutReviews);
    router.get("/productReviews/:product_id", productController.getProductReviews);
    router.get("/addReview", reviewController.addingReview);
    router.get("/addReviewImages", reviewController.addingReviewImages);
    // ASHLEY ENDPOINTS - seller platform
    router.get("/products/:sellerId", sellerController.processGetAllProductsOfSeller);
    router.get("/getRecommendedProductsBasedOnCat", productController.getRecommendedProductsBasedOnCat);
    // NHAT TIEN ENDPOINTS - Homepage, Last Viewed, Wishlist, Product Details
    router.post("/getWishlistItems", productController.getWishlistItems);
    router.post("/getLastViewed", productController.getLastViewed);
    router.post("/productDetails", productController.processPublicProductDetails);
    router.get("/cartDetails", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.retrieveCartDetails);
    router.get("/topProducts", productController.getTopProducts);
    router.get("/searchBarPredictions", productController.getSearchBarPredictions);
    router.post("/searchResult", productController.getSearchResult);
    router.get("/productsBasedOnCategory", productController.getProductsBasedOnCategory);
    router.post("/insertWishlistedProduct", productController.insertWishlistedProduct);
    router.put("/updateCustLastViewedCat", customerController.updateCustLastViewedCat);
    router.delete("/deleteWishlistedProduct", productController.deleteWishlistedProduct);
    router.post("/checkWishlistProductExistence", productController.checkWishListProductExistence);
    router.get("/getAllListedProducts", productController.getAllListedProducts);
    router.post("/getCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.retrieveCartDetails);
    router.post("/alterCart", verifyJWT_1.default, (0, verifyRoles_1.default)("customer"), cartController.alterCartDetails);
}
exports.default = default_1;
//# sourceMappingURL=Routes.js.map