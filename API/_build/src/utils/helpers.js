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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const users_1 = __importDefault(require("../models/Users/users"));
const ApiError_1 = __importDefault(require("./ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const country = require('../services/country');
let helpers = {};
helpers.hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 8;
        return yield bcryptjs_1.default.hash(password, saltRounds);
    });
};
helpers.generateToken = function (createData, id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = { id, email };
            if (!id || !email)
                throw new ApiError_1.default(`something wrong with ${id} or ${email}`, http_status_1.default.BAD_REQUEST);
            // const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
            var token = yield jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECRETKEY, { expiresIn: config_1.default.JWT_EXPIRES_IN });
            if (token) {
                token = { accessToken: token };
                const convertToObj = !createData.tokens ? JSON.stringify([token]) : JSON.stringify([...JSON.parse(createData.tokens), token]);
                createData.tokens = convertToObj;
                createData.token = JSON.stringify(token);
                return token;
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    });
};
helpers.filterObjectData = function (createData, access, refresh) {
    return {
        fullName: createData.fullName,
        userName: createData.userName,
        country: createData.country,
        email: createData.email,
        phoneNumber: createData.phoneNumber,
        referral: createData.referral,
        avatar: createData.avatar,
        isVerified: createData.isVerified,
        blacklisted: createData.isBlacklisted,
        accessTokens: access === null || access === void 0 ? void 0 : access.accessToken,
        refreshToken: refresh === null || refresh === void 0 ? void 0 : refresh.refreshToken,
        currency: createData.currency,
        isAdmin: createData.isAdmin
    };
};
helpers.comparePassword = function (oldPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const compare = yield bcryptjs_1.default.compare(newPassword, oldPassword);
            return compare;
        }
        catch (error) {
            throw new ApiError_1.default("Error with comparing password", http_status_1.default.BAD_REQUEST, error);
        }
    });
};
helpers.generateRefreshToken = function ({ accessToken }, req) {
    return __awaiter(this, void 0, void 0, function* () {
        // verify token
        const decoded = yield jsonwebtoken_1.default.verify(accessToken, config_1.default.JWT_SECRETKEY);
        console.log(decoded.id, req.id);
        if (decoded.id === req.id) {
            const data = yield users_1.default.findOne({ where: { uuid: decoded.id } });
            if (!data)
                throw new ApiError_1.default(`Can't grant request of unauthenticated user`, http_status_1.default.NOT_FOUND);
            // get fresh token
            const freshtoken = this.generateToken(data, data.uuid, data.email);
            console.log(freshtoken);
            // Permission granted: Log that accessToken out.
            let convertToJson = JSON.parse(data.tokens);
            convertToJson.filter((findAccessToken, i) => {
                if (findAccessToken === accessToken) {
                    convertToJson.splice(i, 1);
                    convertToJson = JSON.stringify(convertToJson);
                }
            });
            // Update changes.
            users_1.default.update({ tokens: convertToJson }, { where: { uuid: data.uuid } });
            return freshtoken;
        }
    });
};
helpers.createKeyToken = function (user, conf, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = yield node_crypto_1.default.createHash("SHA256").update(conf.JWT_SECRETKEY + (Date.now())).digest("hex");
        if (id) {
            yield users_1.default.update({ oneTimeKeyToken: token }, { where: { uuid: id } });
        }
        return token;
    });
};
helpers.countryDialCode = function (iso3) {
    return new Promise((resolve, reject) => {
        country.forEach(({ code, dial_code, name }) => {
            if (code === iso3)
                return resolve({ code, dial_code, name });
        });
        reject(null);
    });
};
helpers.generateInvoiceId = function () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const length = 8;
    let invoiceId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        invoiceId += characters[randomIndex];
    }
    return invoiceId;
};
exports.default = helpers;
