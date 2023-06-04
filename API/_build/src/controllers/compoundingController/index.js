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
const compoundingPlans_1 = __importDefault(require("../../models/mode/compoundingPlans"));
var compoundingController = {};
compoundingController.makeInvestment = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
compoundingController.getCompoundingPlans = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // create the first and data for the plans.
            const ifExist = yield compoundingPlans_1.default.findAll();
            if (ifExist.length) {
                res.send(ifExist);
            }
        }
        catch (error) {
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
compoundingController.getACompoundingPlans = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uuid = req.query.calculateId;
            console.log(uuid);
            // create the first and data for the plans.
            const ifExist = yield compoundingPlans_1.default.findOne({ where: { uuid } });
            if (ifExist) {
                res.send(ifExist);
            }
        }
        catch (error) {
            res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
};
exports.default = compoundingController;
