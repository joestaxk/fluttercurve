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
const helpers_1 = __importDefault(require("../../utils/helpers"));
const depositPlans_1 = __importDefault(require("../../models/services/depositPlans"));
const deposit_1 = __importDefault(require("../../models/Users/deposit"));
const coinbase_1 = __importDefault(require("../../services/userServices/coinbase"));
let serviceController = {};
serviceController.getCountryCode = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield helpers_1.default.countryDialCode(req.query.code);
            if (!results)
                throw new ApiError_1.default('COUNTRY CODE', http_status_1.default.NOT_FOUND, `${req.query.code}, what's that?`);
            res.send(results);
        }
        catch (error) {
            console.log(error);
            throw new ApiError_1.default('Somthing went wrong', http_status_1.default.BAD_REQUEST, error);
        }
    });
};
serviceController.getDepositPlans = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // create the first and data for the plans.
            const ifExist = yield depositPlans_1.default.findAll();
            if (ifExist.length) {
                res.send(ifExist);
            }
        }
        catch (error) {
            res.send(error);
        }
    });
};
serviceController.getActiveDeposit = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // query DB for data
            const depoData = yield deposit_1.default.findAll({ where: { status: "NEW", clientId: req.id } });
            if (!depoData.length)
                return res.send(depoData);
            res.send(depoData);
        }
        catch (error) {
            console.log(error);
        }
    });
};
serviceController.newDepositRequest = function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // we communicate with a third party api - Coinbase
            const { chargeAPIData, depoInfoData } = req.body;
            const bodyData = {
                description: chargeAPIData.description,
                metadata: {
                    customer_id: req.id,
                    customer_name: chargeAPIData.metadata.customer_name,
                },
                name: depoInfoData.plan,
                pricing_type: 'fixed_price',
                local_price: {
                    amount: chargeAPIData.local_price.amount,
                    currency: chargeAPIData.local_price.currency
                },
            };
            const response = yield coinbase_1.default.createCharge(bodyData);
            console.log(response.timeline[response.timeline.length - 1]);
            if (response.code === "ETIMEDOUT")
                throw new ApiError_1.default(response.code, http_status_1.default.REQUEST_TIMEOUT, "Request timeout!");
            if (response.code === "EAI_AGAIN")
                throw new ApiError_1.default(response.code, http_status_1.default.REQUEST_TIMEOUT, "Network unavalaible!");
            if (!response.expires_at)
                throw new ApiError_1.default(response.code, http_status_1.default.BAD_REQUEST, "Something Went Wrong!");
            //    console.log()
            const createDepositRecord = Object.assign(Object.assign({ clientId: req.id, chargeID: response.code, plan: response.name }, depoInfoData), { status: (_a = response.timeline[response.timeline.length - 1]) === null || _a === void 0 ? void 0 : _a.status, expiresAt: response.expires_at });
            const create = yield deposit_1.default.create(createDepositRecord);
            yield create.save();
            //    send email.
            res.send({ message: "Redirecting...", data: { next: createDepositRecord.chargeID } });
        }
        catch (error) {
            console.log(error);
            res.send(error);
        }
    });
};
serviceController.getAllDepositRequest = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // we communicate with a third party api - Coinbase
            const depositList = yield deposit_1.default.findAll({ where: { clientId: req.id } });
            console.log(depositList);
            res.send(depositList);
        }
        catch (error) {
            console.log(error);
            res.send(error);
        }
    });
};
serviceController.getAllSuccessfulInvesment = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // we communicate with a third party api - Coinbase
            const successfulInvestment = yield deposit_1.default.findAll({ where: { clientId: req.id, status: "SUCCESSFUL" } });
            console.log(successfulInvestment);
            res.send(successfulInvestment);
        }
        catch (error) {
            console.log(error);
            res.send(error);
        }
    });
};
exports.default = serviceController;
