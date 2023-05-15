"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigin_1 = __importDefault(require("./allowedOrigin"));
const corsOptions = {
    origin: (origin, callback) => {
        console.log("hit cors", origin);
        if (allowedOrigin_1.default.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS...'));
        }
    },
    optionSuccessStatus: 200
};
exports.default = corsOptions;
//# sourceMappingURL=corsOptions.js.map