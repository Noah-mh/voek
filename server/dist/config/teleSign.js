"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TeleSignSDK = require('telesignsdk');
const config_1 = __importDefault(require("./config"));
const rest_endpoint = "https://rest-api.telesign.com";
const timeout = 10 * 1000; // 10 secs
const client = new TeleSignSDK(config_1.default.telesignCustomerId, config_1.default.telesignAPIKey, rest_endpoint, timeout);
exports.default = client;
//
//# sourceMappingURL=teleSign.js.map