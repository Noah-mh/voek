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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const Routes_1 = __importDefault(require("./Routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bodyParser = __importStar(require("body-parser"));
const credentials_1 = __importDefault(require("./middlewares/credentials"));
const corsOptions_1 = __importDefault(require("../config/corsOptions"));
const port = config_1.default.get("port");
const host = config_1.default.get("host");
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cookie_parser_1.default)());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(credentials_1.default);
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, cors_1.default)({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use(router);
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const acceptLanguageHeader = req.headers["accept-language"];
//   const languages = acceptLanguageHeader ? acceptLanguageHeader.split(",") : [];
//   const locale = languages[0]?.trim() || "en"; // Set default locale to 'en' if none is provided
//   // req.locale = locale;
//   console.log("locale", locale);
//   next();
// });
(0, Routes_1.default)(app, router);
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json(error.message);
});
app.listen(port, host, () => {
    logger_1.default.info(`Server is listening on http://${host}:${port}`);
});
//# sourceMappingURL=App.js.map