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
exports.buildCompondingPlans = void 0;
const http_status_1 = __importDefault(require("http-status"));
const depositPlans_1 = __importDefault(require("../models/services/depositPlans"));
const compoundingPlans_1 = __importDefault(require("../models/mode/compoundingPlans"));
function buildDepositPlans() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // create the first and data for the plans.
            const data = [
                {
                    plan: "Deluxe",
                    minAmt: "50000",
                    maxAmt: "90000",
                    duration: "7",
                    gurantee: "100",
                    dailyInterestRate: "0.71",
                },
                {
                    plan: "Nfp",
                    minAmt: "100000",
                    maxAmt: "200000",
                    duration: "30",
                    gurantee: "100",
                    dailyInterestRate: "1.10",
                },
                {
                    plan: "Premium",
                    minAmt: "2000000",
                    maxAmt: "10000000",
                    duration: "365",
                    gurantee: "100",
                    dailyInterestRate: "1.36",
                },
                {
                    plan: "Erc 20",
                    minAmt: "302000",
                    maxAmt: "1900000",
                    duration: "365",
                    gurantee: "100",
                    dailyInterestRate: "1.92",
                },
                {
                    plan: "Ieo",
                    minAmt: "217000",
                    maxAmt: "300000",
                    duration: "210",
                    gurantee: "100",
                    dailyInterestRate: "2.38",
                }
            ];
            const ifExist = yield depositPlans_1.default.findAndCountAll();
            if (ifExist.count > 1)
                return console.error("Duplicate input", http_status_1.default.NOT_ACCEPTABLE, { message: "You can't add new data, you can only update existing data(s)." });
            for (let i = 0; i < data.length; ++i) {
                const createPlan = yield depositPlans_1.default.create(data[i]);
                if (!createPlan) {
                    return console.error("what's wrong", http_status_1.default.SERVICE_UNAVAILABLE);
                }
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = buildDepositPlans;
function buildCompondingPlans() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // create the first and data for the plans.
            const data = [
                {
                    plan: "Optima Compounding (Promo)",
                    minAmt: "10000",
                    maxAmt: "499999",
                    duration: "1",
                    interestRate: "12",
                },
            ];
            const ifExist = yield compoundingPlans_1.default.findAndCountAll();
            if (ifExist.count > 1)
                return console.error("Duplicate input", http_status_1.default.NOT_ACCEPTABLE, { message: "You can't add new data, you can only update existing data(s)." });
            data.forEach((d) => __awaiter(this, void 0, void 0, function* () {
                const createPlan = yield compoundingPlans_1.default.create(d);
                if (!createPlan) {
                    return console.error("what's wrong", http_status_1.default.SERVICE_UNAVAILABLE);
                }
            }));
        }
        catch (error) {
            throw error;
        }
    });
}
exports.buildCompondingPlans = buildCompondingPlans;
