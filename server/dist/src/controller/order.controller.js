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
exports.processOrderReceived = exports.processGetCustomerReceivedOrders = exports.processhandleGetCustomerDeliveredOrders = exports.processHandleGetCustomerOrders = void 0;
const orderModel = __importStar(require("../model/order.model"));
const processHandleGetCustomerOrders = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id)
            return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerOrders(parseInt(customer_id));
        return res.json({ listedOrders: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processHandleGetCustomerOrders = processHandleGetCustomerOrders;
const processhandleGetCustomerDeliveredOrders = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id)
            return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerDeliveredOrders(parseInt(customer_id));
        return res.json({ listedOrdersDelivered: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processhandleGetCustomerDeliveredOrders = processhandleGetCustomerDeliveredOrders;
const processGetCustomerReceivedOrders = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        if (!customer_id)
            return res.sendStatus(400);
        const result = await orderModel.handleGetCustomerReceivedOrders(parseInt(customer_id));
        return res.json({ listedOrdersReceived: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.processGetCustomerReceivedOrders = processGetCustomerReceivedOrders;
const processOrderReceived = async (req, res, next) => {
    try {
        const { orders_product_id } = req.params;
        if (!orders_product_id)
            return res.sendStatus(400);
        const result = await orderModel.handleOrderReceived(parseInt(orders_product_id));
        return res.sendStatus(200);
    }
    catch (err) {
        return next(err);
    }
};
exports.processOrderReceived = processOrderReceived;
//# sourceMappingURL=order.controller.js.map