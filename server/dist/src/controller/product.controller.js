"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWishListProductExistence = exports.getProductReviews = exports.getProductDetailsWithoutReviews = exports.deleteWishlistedProduct = exports.insertWishlistedProduct = exports.getProductsBasedOnCategory = exports.getSearchResult = exports.getSearchBarPredictions = exports.getTopProducts = exports.getLastViewed = exports.getWishlistItems = exports.getRecommendedProductsBasedOnCat = exports.processPublicProductDetails = void 0;
const product_model_1 = require("../model/product.model");
const processPublicProductDetails = async (req, res, next) => {
    try {
        console.log();
        const { productId } = req.body;
        const response = await (0, product_model_1.handlesGetProductDetails)(productId);
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
        const response = await (0, product_model_1.handlesGetRecommendedProductsBasedOnCat)(category_id);
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
        const response = await (0, product_model_1.handlesGetWishlistItems)(customerId);
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
        const { customer_id, date_viewed } = req.body;
        const response = await (0, product_model_1.handlesGetLastViewed)(customer_id, date_viewed);
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getLastViewed = getLastViewed;
const getTopProducts = async (req, res, next) => {
    try {
        const response = await (0, product_model_1.handlesTopProducts)();
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
        const response = await (0, product_model_1.handlesSearchBarPredictions)();
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
        const response = await (0, product_model_1.handlesSearchResult)(input);
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.getSearchResult = getSearchResult;
const getProductsBasedOnCategory = async (req, res, next) => {
    try {
        const { category_id } = req.body;
        const response = await (0, product_model_1.handlesProductsBasedOnCategory)(category_id);
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
        const response = await (0, product_model_1.handlesInsertingWishlistedProduct)(customerId, productId);
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
    console.log("test2");
    try {
        const { customerId, productId } = req.body;
        const response = await (0, product_model_1.handlesDeletingWishlistedProduct)(customerId, productId);
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
        const response = await (0, product_model_1.handleProductDetailsWithoutReviews)(product_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.status(200).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductDetailsWithoutReviews = getProductDetailsWithoutReviews;
const getProductReviews = async (req, res, next) => {
    try {
        const product_id = parseInt(req.params.product_id);
        const response = await (0, product_model_1.handleProductReviews)(product_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.status(200).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductReviews = getProductReviews;
const checkWishListProductExistence = async (req, res, next) => {
    console.log("test2");
    try {
        const { customerId, productId } = req.body;
        const response = await (0, product_model_1.handlesCheckWishlistProductExistence)(customerId, productId);
        console.log("response in controller: ", response);
        // if (response.length === 0) return res.sendStatus(404);
        // return res.sendStatus(response[0]["COUNT(*)"] === 0 ? 404 : 200);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.checkWishListProductExistence = checkWishListProductExistence;
//# sourceMappingURL=product.controller.js.map