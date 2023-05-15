"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Sib = require('sib-api-v3-sdk');
const config_1 = __importDefault(require("./config"));
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = config_1.default.sendInBlueAPIKey;
exports.default = Sib;
//# sourceMappingURL=sendInBlue.js.map