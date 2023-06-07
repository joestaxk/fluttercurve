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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const users_1 = __importDefault(require("../../models/Users/users"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
const email_service_1 = __importStar(require("../../services/email-service"));
const config_1 = __importDefault(require("../../config/config"));
const referrals_1 = __importDefault(require("../../models/Users/referrals"));
let authController = {};
authController.register = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fullName, userName, email, phoneNumber, country, currency, annualIncome, referral, password } = req.body;
        try {
            // sanitize req body.
            const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!fullName || !userName || !emailReg.test(email) || phoneNumber.length < 10 || !currency || !country || !password || !annualIncome) {
                throw new ApiError_1.default("WRONG CREDENTIALS", http_status_1.default.NOT_ACCEPTABLE, "Wrong credentials!");
            }
            // futher validations
            // password -- what are we validating in password?
            // if email already exist?
            const ifExist = yield users_1.default.findOne({ where: { email } });
            if (ifExist) {
                throw new ApiError_1.default("AVOID DUPLICATE", http_status_1.default.NOT_ACCEPTABLE, "Email already exists");
            }
            // if user already exist?
            const ifUsername = yield users_1.default.findOne({ where: { userName } });
            if (ifUsername) {
                throw new ApiError_1.default("AVOID DUPLICATE", http_status_1.default.NOT_ACCEPTABLE, "Username already exists");
            }
            // Referral bonus
            let createRef = false;
            let ifReferrerExist;
            if (referral) {
                ifReferrerExist = (yield users_1.default.findOne({ where: { userName: referral } }));
                // EXIT THAT USER
                if (!ifReferrerExist)
                    throw new ApiError_1.default("Refferal issues", http_status_1.default.BAD_REQUEST, "Wrong referrer credentials, continue without a referral!");
                if (!ifReferrerExist.isVerified)
                    throw new ApiError_1.default("Refferal issues", http_status_1.default.BAD_REQUEST, "Unverified referrer, continue without a referral !");
                if (ifReferrerExist.isBlacklisted)
                    throw new ApiError_1.default("Refferal issues", http_status_1.default.BAD_REQUEST, "Referrer has been blacklisted, continue without a referral!");
                createRef = true;
            }
            const createData = yield users_1.default.build({
                fullName,
                userName,
                email,
                phoneNumber,
                country,
                annualIncome,
                currency,
                referral,
                password,
            });
            const access = yield helpers_1.default.generateToken(createData, createData.uuid, createData.email);
            // verify email - TEST PURPOSE HERE
            const template = `
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">Welcome to <b>Flutter curve</b> and thanks for signing up! You're one step closer to earning.</p>
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem">This process is just a simple verification process where you get to click the link below to verify you as the owner.</p>
           <a href="${config_1.default.APP_NAME}/verification?token=${createData.uuid}">
            <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background:#000;border-radius:1rem;color:#fff;padding:.8rem">
                <span>Verify My Account!</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
            </a>
        `;
            const htmlMarkup = (0, email_service_1.EmailTemplate)({ user: createData.userName, template });
            // Send using cb
            (0, email_service_1.default)("Verification Link sent", htmlMarkup, email, function (done, err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                        return res.status(http_status_1.default.BAD_REQUEST).send({ message: "Couldn't send Verification mail. check network connection" });
                    }
                    if (createRef) {
                        yield referrals_1.default.create({
                            ClientId: ifReferrerExist.id,
                            ClientUuid: ifReferrerExist.uuid,
                            userId: createData.uuid,
                            userName: createData.userName,
                            avatar: createData.avatar,
                        });
                    }
                    yield createData.save();
                    res.status(http_status_1.default.CREATED).send({ message: "Verification link has been sent to your mailbox.", data: access });
                });
            });
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
authController.login = function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailReg.test(email) || !password.length) {
            throw new ApiError_1.default("WRONG CREDENTIALS", http_status_1.default.NOT_ACCEPTABLE, "Wrong credentials");
        }
        try {
            const ifExist = yield users_1.default.findOne({ where: { email }, include: ['Referrals', 'userAccount', 'Compounding'] });
            if (!ifExist) {
                throw new ApiError_1.default("NO ACCOUNT", http_status_1.default.NOT_ACCEPTABLE, "Account doesn't exist!");
            }
            const oldPassword = ifExist.password;
            if (!(yield helpers_1.default.comparePassword(oldPassword, password))) {
                throw new ApiError_1.default("WRONG PASSWORD", http_status_1.default.NOT_ACCEPTABLE, "Incorrect credentials");
            }
            // if blacklisted
            if (ifExist.isBlacklisted) {
                throw new ApiError_1.default("User Account Suspended", http_status_1.default.UNAUTHORIZED, "Sorry, this Account has been susended");
            }
            if (!ifExist.isVerified) {
                throw new ApiError_1.default("Verify Account", http_status_1.default.UNAUTHORIZED, "Account is not verified");
            }
            const access = yield helpers_1.default.generateToken(ifExist, ifExist.uuid, ifExist.email);
            const update = yield users_1.default.update({ tokens: ifExist.tokens, token: JSON.stringify(access) }, { where: { uuid: ifExist.uuid } });
            if (!update.length)
                return;
            res.status(http_status_1.default.OK).send({ message: "You've signed in successfully", userData: Object.assign(Object.assign({}, helpers_1.default.filterObjectData(ifExist)), { noRefferedUser: (_a = ifExist.Referrals) === null || _a === void 0 ? void 0 : _a.length, userAccount: ifExist.userAccount, compounding: ifExist.Compounding }), session: access });
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
authController.forgetPassword = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        // validate email
        let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        // if valid
        try {
            if (!emailReg.test(email)) {
                throw new ApiError_1.default("Invalid Email", http_status_1.default.NOT_ACCEPTABLE, "Email is not valid");
            }
            const ifExist = yield users_1.default.findOne({ where: { email } });
            if (!ifExist) {
                throw new ApiError_1.default("Not found", http_status_1.default.NOT_FOUND, "User was not found");
            }
            if (!ifExist.isVerified) {
                throw new ApiError_1.default("Verify Account", http_status_1.default.UNAUTHORIZED, "Account is not verified");
            }
            // if blacklisted
            if (ifExist.isBlacklisted) {
                throw new ApiError_1.default("User Account Suspended", http_status_1.default.UNAUTHORIZED, "Sorry this Account has been susended");
            }
            const keyToken = yield helpers_1.default.createKeyToken(ifExist.uuid);
            console.log(keyToken);
            // SEND MAIL
            const template = `
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">Welcome to <b>Flutter curve</b>. Seems like you misplaced your old password?</p>
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem"> Make sure you're the one that requested for <b>Forgotten Password</b>. Click the link below.</p>
           <a href="${config_1.default.APP_NAME}/forget-password?token=${keyToken}" style="text-decoration: none">
            <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background:#000;border-radius:1rem;color:#fff;padding:.8rem">
                <span>Get New Password.</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
            </a>
        `;
            const htmlMarkup = (0, email_service_1.EmailTemplate)({ user: ifExist.userName, template });
            // Send using cb
            (0, email_service_1.default)("Change password link sent", htmlMarkup, email, function (done, err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                        return res.status(http_status_1.default.BAD_REQUEST).send({ message: "Couldn't send Change of Password link. check network connection" });
                    }
                    res.status(http_status_1.default.CREATED).send({ message: "Change of password link sent to mail box" });
                });
            });
        }
        catch (error) {
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
exports.default = authController;
