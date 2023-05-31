"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const compoundingController_1 = __importDefault(require("../../../controllers/compoundingController"));
const auth_1 = require("../../../middlewares/auth");
const buildDepositPlans_1 = require("../../../services/buildDepositPlans");
(0, buildDepositPlans_1.buildCompondingPlans)().then(res => { });
/**
   Make Investment
    @method GET
**/
router.get('/makeInvestment', auth_1.UserAuth, compoundingController_1.default.makeInvestment);
/**
   GET Investment
    @method GET
**/
router.get('/getCompoundingPlans', auth_1.UserAuth, compoundingController_1.default.getCompoundingPlans);
/**
   GET Investment
    @method GET
**/
router.get('/getACompoundingPlans', auth_1.UserAuth, compoundingController_1.default.getACompoundingPlans);
module.exports = router;
