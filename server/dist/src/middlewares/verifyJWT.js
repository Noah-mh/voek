"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization ?? req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, config_1.default.accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const decodedToken = decoded;
        req.user_id = decodedToken.UserInfo.customer_id || decodedToken.UserInfo.seller_id;
        req.role = decodedToken.UserInfo.role;
        next();
    });
};
exports.default = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map