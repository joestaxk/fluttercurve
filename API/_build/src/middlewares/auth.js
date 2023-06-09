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
exports.UserAuth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const users_1 = __importDefault(require("../models/Users/users"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// Client Authorization Handler
const UserAuth = function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const bearerToken = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // DO SOME JWT VERIFICATION
        try {
            if (bearerToken) {
                const decoded = yield jsonwebtoken_1.default.verify(bearerToken, config_1.default.JWT_SECRETKEY);
                //check user
                const ifUserExist = yield users_1.default.findOne({ where: { uuid: decoded.id } });
                if (!ifUserExist) {
                    throw new ApiError_1.default("Unauthorized user", http_status_1.default.NOT_FOUND, "We couldn't find user");
                }
                const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds
                // Calculate the remaining time until expiration in minutes
                const remainingMinutes = Math.floor((decoded.exp - currentTimestamp) / 60);
                // if (remainingMinutes <= 20) {
                //     console.log('Token is expiring within the next 20 minutes.');
                //     //  send off refresh token
                // } else {
                //     console.log('Token is still valid or has more than 20 minutes remaining until expiration.');
                // }
                //  // check if token is registered
                const convertToJson = JSON.parse(ifUserExist.tokens);
                if (!convertToJson.length) {
                    throw new ApiError_1.default("Unauthorized user", http_status_1.default.UNAUTHORIZED, "Account has been logged out");
                }
                const srch = convertToJson.filter((accessToken) => bearerToken === accessToken.accessToken);
                if (!srch || !srch.length) {
                    throw new ApiError_1.default("Unauthorized user", http_status_1.default.UNAUTHORIZED, "Account has been logged out");
                }
                // if user isBlacklisted
                if (ifUserExist.isBlacklisted) {
                    throw new ApiError_1.default("Unauthorized user", http_status_1.default.UNAUTHORIZED, "Sorry this Account has been susended");
                }
                if (!ifUserExist.isVerified) {
                    throw new ApiError_1.default("Unauthorized user", http_status_1.default.UNAUTHORIZED, "Unverified account, You are not meant to be here");
                }
                req.id = ifUserExist.uuid;
                next();
            }
            else {
                throw new ApiError_1.default("Unauthorization user", http_status_1.default.UNAUTHORIZED, "no bearer token");
            }
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
exports.UserAuth = UserAuth;
