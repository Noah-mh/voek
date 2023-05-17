"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.capturePayment = exports.createOrder = void 0;
const config_1 = __importDefault(require("../../config/config"));
const axios_1 = __importDefault(require("axios"));
const base = "https://api-m.sandbox.paypal.com";
const createOrder = async (amount) => {
    const accessToken = await (0, exports.generateAccessToken)();
    const url = `${base}/v2/checkout/orders`;
    const response = await axios_1.default.post(url, {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "SGD",
                    value: amount,
                },
            },
        ],
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return handleResponse(response);
};
exports.createOrder = createOrder;
const capturePayment = async (orderId) => {
    const accessToken = await (0, exports.generateAccessToken)();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await axios_1.default.post(url, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return handleResponse(response);
};
exports.capturePayment = capturePayment;
const generateAccessToken = async () => {
    const auth = Buffer.from(config_1.default.paypalClientId + ":" + config_1.default.paypalClientSecret).toString("base64");
    const response = await axios_1.default.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
};
exports.generateAccessToken = generateAccessToken;
const handleResponse = async (response) => {
    if (response.status === 200 || response.status === 201) {
        try {
            const temp = response.data;
            return temp;
        }
        catch (error) {
            console.log(error);
        }
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage);
};
//# sourceMappingURL=paypal.model.js.map