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
exports.alterCartDetails = exports.retrieveCartDetails = void 0;
const cartModel = __importStar(require("../model/cart.model"));
const retrieveCartDetails = async (req, res, next) => {
    try {
        const { customer_id } = req.body;
        console.log("Connected to Controller");
        const response = await cartModel.handlesGetCartDetails(parseInt(customer_id));
        if (!response?.length)
            return res.sendStatus(404);
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.retrieveCartDetails = retrieveCartDetails;
const alterCartDetails = async (req, res, next) => {
    console.log("Connected to alter Controller");
    try {
        const { customer_id, sku, quantity, new_sku, product_id } = req.body;
        const response = await cartModel.handleAlterCart(customer_id, sku, quantity, new_sku, product_id);
        if (!response?.length)
            return res.sendStatus(404);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.alterCartDetails = alterCartDetails;
//# sourceMappingURL=cart.controller.js.map