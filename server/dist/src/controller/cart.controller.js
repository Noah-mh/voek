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
exports.clearCart = exports.insertShipment = exports.updateCustomerCoins = exports.updateProductStock = exports.insertOrderProduct = exports.insertOrder = exports.insertPayment = exports.insertCart = exports.alterQuantCartDetails = exports.retrieveCartDetails = void 0;
const cartModel = __importStar(require("../model/cart.model"));
const retrieveCartDetails = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        console.log("Connected to getCart Controller");
        const response = await cartModel.handlesGetCartDetails(customer_id);
        // if (!response?.length)
        //   return res.status(200).json({ message: "No cart details found" });
        return res.json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.retrieveCartDetails = retrieveCartDetails;
const alterQuantCartDetails = async (req, res, next) => {
    console.log("Connected to alterQuant Controller");
    try {
        const { customer_id, sku, quantity } = req.body;
        const response = await cartModel.handleAlterQuantCart(customer_id, sku, quantity);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.alterQuantCartDetails = alterQuantCartDetails;
const insertCart = async (req, res, next) => {
    try {
        const { quantity, customerId, productId, sku } = req.body;
        const response = await cartModel.handlesInsertCart(quantity, customerId, productId, sku);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertCart = insertCart;
const insertPayment = async (req, res, next) => {
    try {
        const { customer_id, amount } = req.body;
        const response = await cartModel.handleInsertPayment(customer_id, amount);
        return res.status(201).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertPayment = insertPayment;
const insertOrder = async (req, res, next) => {
    try {
        const { customer_id, payment_id, discount_applied, coins_redeemed, address_id, } = req.body;
        const response = await cartModel.handleInsertOrder(customer_id, payment_id, discount_applied, coins_redeemed, address_id);
        return res.status(201).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertOrder = insertOrder;
const insertOrderProduct = async (req, res, next) => {
    try {
        const { sku, orders_id, product_id, totalPrice, quantity, shipment_id } = req.body;
        const response = await cartModel.handleInsertOrderProduct(sku, orders_id, product_id, totalPrice, quantity);
        return res.status(201).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertOrderProduct = insertOrderProduct;
const updateProductStock = async (req, res, next) => {
    try {
        const { quantityDeduct, sku } = req.body;
        const response = await cartModel.handleUpdateProductStock(quantityDeduct, sku);
        return res.status(200).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateProductStock = updateProductStock;
const updateCustomerCoins = async (req, res, next) => {
    try {
        const { customer_id, coins } = req.body;
        const response = await cartModel.handleAlterCustomerCoins(customer_id, coins);
        return res.status(200).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.updateCustomerCoins = updateCustomerCoins;
const insertShipment = async (req, res, next) => {
    try {
        const { orders_product_id, customer_id } = req.body;
        const response = await cartModel.handleInsertShipment(orders_product_id, customer_id);
        return res.status(201).json(response);
    }
    catch (err) {
        return next(err);
    }
};
exports.insertShipment = insertShipment;
const clearCart = async (req, res, next) => {
    console.log("Connected to clearCart Controller");
    try {
        const { customer_id } = req.body;
        const response = await cartModel.handleClearCart(customer_id);
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.clearCart = clearCart;
// export const alterSKUCartDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("Connected to alterSKU Controller");
//   try {
//     const { customer_id, sku, new_sku, product_id } = req.body;
//     const response: Array<object> = await cartModel.handleAlterSKUCart(
//       customer_id,
//       sku,
//       new_sku,
//       product_id
//     );
//     if (!response?.length) return res.sendStatus(404);
//     return res.sendStatus(200);
//   } catch (err: any) {
//     return next(err);
//   }
// };
//# sourceMappingURL=cart.controller.js.map