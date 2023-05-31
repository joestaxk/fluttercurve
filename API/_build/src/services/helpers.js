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
            // const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
            var token = yield jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECRETKEY, { expiresIn: config_1.default.JWT_EXPIRES_IN });
            if (token) {
                token = { accessToken: token };
                let tokens = [...createData.tokens, token];
                createData.tokens = tokens;
                createData.token = token;
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
        isVerified: createData.isVerified,
        blacklist: createData.blacklist,
        tokens: access.token,
        refreshToken: refresh.refreshToken
    };
};
// helpers.generateRefreshToken = async function(accesstoken, reqNewAcessToken) {
//     // verify token
//     const decoded = await jwt.verify(accesstoken, config.JWT_SECRETKEY);
//     if(decoded.id === this.id) {            
//         const payload = {id: decoded.id, email: decoded.email}
//         const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
//         var refreshToken = await jwt.sign(payload, config.JWT_SECRETKEY, {expiresIn: config.JWT_REFRESH_EXPIRES_IN});
//         //generate new accessToken
//         let accessToken;
//         if(reqNewAcessToken) {
//             accesstoken =  await this.generateToken(decoded.id, decoded.email)
//         }
//         const returnTokens = {accessToken, refreshToken}
//         if(!reqNewAcessToken) delete returnTokens.accessToken;
//         return returnTokens
//     }
// }
exports.default = helpers;
