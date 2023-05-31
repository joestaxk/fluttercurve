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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const users_1 = __importDefault(require("../../models/Users/users"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
const referrals_1 = __importDefault(require("../../models/Users/referrals"));
let userController = {};
userController.verifyUserAccount = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // get userId
            const id = req.query.token;
            if (!id)
                throw new ApiError_1.default("Missing credentials", http_status_1.default.BAD_REQUEST, "user ID not found in params");
            // If verified
            let amIverified = yield users_1.default.findOne({ where: { uuid: id } });
            if (amIverified.isVerified)
                return res.send({ message: "Account has already been verified", next: true });
            // update verification on user
            const isVerify = yield users_1.default.update({ isVerified: true }, { where: { uuid: id } });
            if (!isVerify.length) {
                throw new ApiError_1.default("NOT FOUND", http_status_1.default.NOT_FOUND, "Something went wrong with verification. try again!");
            }
            // return error/success report.
            // send off a new refresh token
            const access = yield helpers_1.default.generateRefreshToken(JSON.parse(amIverified.token), req);
            console.log(access);
            res.status(http_status_1.default.OK).send({ message: "Account has been verified successfully", data: access });
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
userController.getMe = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = yield users_1.default.findOne({ where: { uuid: req.id }, include: ['Referrals', 'userAccount', 'Compounding'] });
            res.send(Object.assign(Object.assign({}, helpers_1.default.filterObjectData(me)), { noRefferedUser: (_a = me.Referrals) === null || _a === void 0 ? void 0 : _a.length, userAccount: me.userAccount, compounding: me.Compounding }));
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
userController.getReferredUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ref = yield referrals_1.default.findAll({ where: { ClientUuid: req.id } });
            const filter = ref.map((res) => {
                return {
                    "firstDeposit": res.firstDeposit,
                    "userName": res.userName,
                    "avatar": res.avatar,
                    "createdAt": (new Date(res.createdAt)).toLocaleString(),
                };
            });
            res.send(filter);
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
userController.logout = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // get the device you want to logout.
            const logoutUser = yield users_1.default.findOne({ where: { uuid: req.id } });
            let convertToJson = JSON.parse(logoutUser.tokens);
            convertToJson.filter(({ accessToken }, i) => {
                if (JSON.parse(logoutUser.token).accessToken === accessToken) {
                    console.log(i);
                    convertToJson.splice(i, 1);
                    convertToJson = JSON.stringify(convertToJson);
                }
            });
            yield users_1.default.update({ tokens: convertToJson, token: "" }, { where: { uuid: logoutUser.uuid } });
            res.send({ message: "You've been Logged out successfully!" });
        }
        catch (error) {
            console.log(error);
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
userController.updatePasswordByLink = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.query) === null || _a === void 0 ? void 0 : _a.token;
        const { newPassword, confirmPassword } = req.body;
        try {
            if (newPassword.length < 8 || confirmPassword !== newPassword)
                throw new ApiError_1.default("Invalid password", http_status_1.default.NOT_ACCEPTABLE, "Password is not valid, password should be >= 8 and equal");
            if (!token)
                throw new ApiError_1.default("Invalid link", http_status_1.default.NOT_ACCEPTABLE, "Invalid forget password link");
            const findToken = yield users_1.default.findOne({ where: { oneTimeKeyToken: token } });
            if (!findToken)
                throw new ApiError_1.default("User not found", http_status_1.default.NOT_FOUND, "User is not found");
            // compare password
            /** if(!(await comparePassword(oldPassword.trim(), findToken.password)))  {
                 throw new ApiError("Incorrect password", httpStatus.NOT_ACCEPTABLE, "Password is not wrong")
             } **/
            // update password once every 24hrs
            const updated = yield users_1.default.update({ password: (yield helpers_1.default.hashPassword(newPassword)) }, { where: { uuid: findToken.uuid } });
            if (updated)
                res.send({ message: "Password has been successfully changed. Go to login" });
            //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
        }
        catch (error) {
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
userController.uploadAvatar = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = req.file;
        try {
            // change the user avatar data
            const user = yield users_1.default.update({ avatar: file.filename }, { where: { uuid: req.id } });
            // const user = await Client.update({referralImage: file.filename}, {where: {referral: req.id }})
            // update profile globally.
            // referral.
            yield referrals_1.default.update({ avatar: file.filename }, { where: { userId: req.id } });
            // send back warming response.
            if (!user[0]) {
                throw new ApiError_1.default("Avatar error", http_status_1.default.BAD_REQUEST, "Profile won't load");
            }
            res.send({ message: "Profile updated successfully." });
        }
        catch (error) {
            // if any
            console.log(error);
            res.send(error);
        }
    });
};
exports.default = userController;
