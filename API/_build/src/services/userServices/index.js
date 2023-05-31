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
const userAccount_1 = __importDefault(require("../../models/Users/userAccount"));
;
var userAccountSetting = {};
userAccountSetting.currency = {
    "$": "dollar",
    "£": "GBP"
};
userAccountSetting.gatherUserData = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            balance: 0,
            totalDeposit: 0,
            totalWithdrawal: 0,
            numberOfReferal: 0,
        };
        const userAccModel = userAccount_1.default.findOne({ where: { userId: id } });
    });
};
