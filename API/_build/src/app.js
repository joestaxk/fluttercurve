"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const v1_1 = __importDefault(require("./routes/v1"));
const rate_limiter_1 = __importDefault(require("./middlewares/rate-limiter"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const config_1 = __importDefault(require("./config/config"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = require("./middlewares/auth");
// initialize express app
const app = (0, express_1.default)();
// gzip compression
app.use((0, compression_1.default)());
// secure http headers
app.use((0, helmet_1.default)());
// parse JSON body req
app.use(express_1.default.json());
// body parser
app.use(body_parser_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// cross-origin
const corsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: config_1.default.validCors,
    optionSuccessStatus: 200,
    headers: ["Content-Type", "Authorization", "xat"],
    // credentials: true, 
    maxAge: 3600,
    preflightContinue: true,
};
app.use((0, cors_1.default)(corsOptions));
// app.options("*", cors(corsOptions));
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:3002/');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	next();
// });
// limit number of request per timing to api route.
if (config_1.default.NODE_ENV === "production") {
    app.use("/v1", rate_limiter_1.default);
}
// when parent url requestss
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("Please request our api at /v1");
}));
// v1 api routes
app.use("/v1", v1_1.default);
app.use('/', express_1.default.static('public/'));
app.use('/private/', auth_1.UserAuth, express_1.default.static('public/private/'));
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Link not found");
});
// convert error to ApiError, if needed
//app.use(errorConverter);
// handle error
//app.use(errorHandler);
// export app
exports.default = app;
