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
exports.getCart = exports.addToCart = exports.getProductCat = exports.getProductsUsingCategory = exports.insertLastViewedProduct = exports.getProductVariationImage = exports.getProductImage = exports.getProductVariationsPricing = exports.getProductVariations = exports.getAllListedProducts = exports.checkWishListProductExistence = exports.getProductReviews = exports.getProductDetailsWithoutReviews = exports.deleteWishlistedProduct = exports.insertWishlistedProduct = exports.getProductsBasedOnCategory = exports.getSearchResult = exports.getSearchBarPredictions = exports.getTopProducts = exports.getLastViewed = exports.getLastViewedProductExistence = exports.getWishlistItems = exports.getRecommendedProductsBasedOnCatWishlist = exports.getRecommendedProductsBasedOnCat = exports.processPublicProductDetails = void 0;
const productModel = __importStar(require("../model/product.model"));
//Noah
const processPublicProductDetails = async (req, res, next) => {
    try {
        console.log();
        const { productId } = req.body;
        if (!productId)
            return res.sendStatus(404);
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
        const { category_id } = req.params;
        const categoryId = parseInt(category_id);
        const response = await productModel.handlesGetRecommendedProductsBasedOnCat(categoryId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getRecommendedProductsBasedOnCat = getRecommendedProductsBasedOnCat;
const getRecommendedProductsBasedOnCatWishlist = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const categoryId = parseInt(category_id);
        const response = await productModel.handlesGetRecommendedProductsBasedOnCatWishlist(categoryId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getRecommendedProductsBasedOnCatWishlist = getRecommendedProductsBasedOnCatWishlist;
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
const getLastViewedProductExistence = async (req, res, next) => {
    try {
        const { customerId, productId, timezone, dateViewed } = req.query;
        const response = await productModel.handlesGetLastViewedProductExistence(parseInt(customerId), parseInt(productId), timezone, dateViewed);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getLastViewedProductExistence = getLastViewedProductExistence;
const getLastViewed = async (req, res, next) => {
    try {
        const { customerId, dateViewed, timezone } = req.body;
        console.log("timezone:", timezone);
        const response = await productModel.handlesGetLastViewed(customerId, timezone, dateViewed);
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
        // if (!response?.length) return res.sendStatus(404);
        return res.send(response);
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
        const { customer_id, product_id } = req.query;
        const customerId = parseInt(customer_id);
        const productId = parseInt(product_id);
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
        if (!product_id)
            return res.sendStatus(404);
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
        if (!product_id)
            return res.sendStatus(404);
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
const getProductVariations = async (req, res, next) => {
    try {
        const { product_Id } = req.params;
        const productId = parseInt(product_Id);
        const response = await productModel.handlesGetProductVariations(productId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductVariations = getProductVariations;
const getProductVariationsPricing = async (req, res, next) => {
    try {
        const { product_Id } = req.params;
        const productId = parseInt(product_Id);
        const response = await productModel.handlesGetProductVariationsPricing(productId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductVariationsPricing = getProductVariationsPricing;
const getProductImage = async (req, res, next) => {
    try {
        const { product_Id } = req.params;
        const productId = parseInt(product_Id);
        const response = await productModel.handlesGetProductImage(productId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductImage = getProductImage;
const getProductVariationImage = async (req, res, next) => {
    try {
        const { sku } = req.params;
        const productId = parseInt(sku);
        const response = await productModel.handlesGetProductVariationImage(sku);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductVariationImage = getProductVariationImage;
const insertLastViewedProduct = async (req, res, next) => {
    try {
        const { productId, customerId, currentDate, timezone } = req.body;
        const response = await productModel.handlesInsertLastViewedProduct(productId, customerId, currentDate, timezone);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertLastViewedProduct = insertLastViewedProduct;
const getProductsUsingCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const categoryId = parseInt(category_id);
        const response = await productModel.handlesGetProductsUsingCategory(categoryId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductsUsingCategory = getProductsUsingCategory;
const getProductCat = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        const productId = parseInt(product_id);
        const response = await productModel.handlesGetProductCat(productId);
        return res.send(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.getProductCat = getProductCat;
//Noah
const addToCart = async (req, res, next) => {
    try {
        const { quantity, customer_id, product_id, sku } = req.body;
        if (!quantity || !customer_id || !product_id || !sku)
            return res.sendStatus(404);
        const response = await productModel.handleAddToCart(quantity, customer_id, product_id, sku);
        if (!response)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        return next(err);
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const { sku } = req.query;
        console.log("sku", sku);
        if (!customer_id || !sku)
            return res.sendStatus(404);
        const response = await productModel.handleCartDetails(parseInt(customer_id), sku);
        if (!response)
            return res.sendStatus(404);
        console.log("response", response);
        return res.json({ cartDetails: response });
    }
    catch (err) {
        return next(err);
    }
};
exports.getCart = getCart;
//# sourceMappingURL=product.controller.js.map