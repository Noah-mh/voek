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
exports.deleteReview = exports.addingReviewImages = exports.addingReview = void 0;
const reviewModel = __importStar(require("../model/review.model"));
const addingReview = async (req, res, next) => {
    try {
        const { product_id, customer_id, rating, comment, sku } = req.body;
        if (!product_id || !customer_id || !rating || !comment || !sku)
            return res.sendStatus(404);
        const response = await reviewModel.handleAddingReview(product_id, customer_id, rating, comment, sku);
        if (!response)
            return res.sendStatus(404);
        return res.json({ response });
    }
    catch (err) {
        return next(err);
    }
};
exports.addingReview = addingReview;
const addingReviewImages = async (req, res, next) => {
    try {
        const { review_id, image_url } = req.body;
        if (!review_id || !image_url)
            return res.sendStatus(404);
        const response = await reviewModel.handleAddingReviewImages(review_id, image_url);
        if (!response)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.addingReviewImages = addingReviewImages;
const deleteReview = async (req, res, next) => {
    try {
        const { review_id, sku } = req.body;
        if (!review_id || !sku)
            return res.sendStatus(404);
        const response = await reviewModel.handleDeleteReview(review_id, sku);
        if (!response)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.deleteReview = deleteReview;
//# sourceMappingURL=review.controller.js.map