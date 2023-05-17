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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllListedProducts = exports.checkWishListProductExistence = exports.getProductReviews = exports.getProductDetailsWithoutReviews = exports.deleteWishlistedProduct = exports.insertWishlistedProduct = exports.getProductsBasedOnCategory = exports.getSearchResult = exports.getSearchBarPredictions = exports.getTopProducts = exports.getLastViewed = exports.getWishlistItems = exports.getRecommendedProductsBasedOnCat = exports.processPublicProductDetails = void 0;
const productModel = __importStar(require("../model/product.model"));
const processPublicProductDetails = async (req, res, next) => {
    try {
        console.log();
        const { productId } = req.body;
        const response = await productModel.handlesGetProductDetails(productId);
        if (response.length === 0)
            return res.sendStatus(404);
        return res.json({ response });
    }
    catch (err) {
        return next(err);
    }
};
exports.processPublicProductDetails = processPublicProductDetails;
const getRecommendedProductsBasedOnCat = async (req, res, next) => {
    try {
        const { category_id } = req.body;
        const response = await productModel.handlesGetRecommendedProductsBasedOnCat(category_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getRecommendedProductsBasedOnCat = getRecommendedProductsBasedOnCat;
const getWishlistItems = async (req, res, next) => {
    try {
        const { customerId } = req.body;
        const response = await productModel.handlesGetWishlistItems(customerId);
        console.log("resonse", response);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getWishlistItems = getWishlistItems;
const getLastViewed = async (req, res, next) => {
    try {
        const { customerId, dateViewed } = req.body;
        const response = await productModel.handlesGetLastViewed(customerId, dateViewed);
        // if (!response?.length) return res.sendStatus(404);
        // return res.sendStatus(200);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getLastViewed = getLastViewed;
const getTopProducts = async (req, res, next) => {
    try {
        const response = await productModel.handlesTopProducts();
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getTopProducts = getTopProducts;
const getSearchBarPredictions = async (req, res, next) => {
    try {
        const response = await productModel.handlesSearchBarPredictions();
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getSearchBarPredictions = getSearchBarPredictions;
const getSearchResult = async (req, res, next) => {
    try {
        const { input } = req.body;
        const response = await productModel.handlesSearchResult(input);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getSearchResult = getSearchResult;
const getProductsBasedOnCategory = async (req, res, next) => {
    try {
        const { category_id } = req.body;
        const response = await productModel.handlesProductsBasedOnCategory(category_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductsBasedOnCategory = getProductsBasedOnCategory;
const insertWishlistedProduct = async (req, res, next) => {
    try {
        console.log("test");
        const { customerId, productId } = req.body;
        const response = await productModel.handlesInsertingWishlistedProduct(customerId, productId);
        if (response === 0)
            return res.sendStatus(404);
        return res.sendStatus(201);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertWishlistedProduct = insertWishlistedProduct;
const deleteWishlistedProduct = async (req, res, next) => {
    try {
        const { customerId, productId } = req.body;
        const response = await productModel.handlesDeletingWishlistedProduct(customerId, productId);
        if (response === 0)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.deleteWishlistedProduct = deleteWishlistedProduct;
const getProductDetailsWithoutReviews = async (req, res, next) => {
    try {
        const product_id = parseInt(req.params.product_id);
        const response = await productModel.handleProductDetailsWithoutReviews(product_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.json({ products: response });
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductDetailsWithoutReviews = getProductDetailsWithoutReviews;
const getProductReviews = async (req, res, next) => {
    try {
        const product_id = parseInt(req.params.product_id);
        const response = await productModel.handleProductReviews(product_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.json({ reviews: response });
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductReviews = getProductReviews;
const checkWishListProductExistence = async (req, res, next) => {
    try {
        const { customerId, productId } = req.body;
        const response = await productModel.handlesCheckWishlistProductExistence(customerId, productId);
        // if (response.length === 0) return res.sendStatus(404);
        // return res.sendStatus(response[0]["COUNT(*)"] === 0 ? 404 : 200);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.checkWishListProductExistence = checkWishListProductExistence;
const getAllListedProducts = async (req, res, next) => {
    try {
        const response = await productModel.handlesGetAllListedProducts();
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getAllListedProducts = getAllListedProducts;
//# sourceMappingURL=product.controller.js.map