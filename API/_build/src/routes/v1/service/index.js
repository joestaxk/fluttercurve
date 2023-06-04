"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const serviceController_1 = __importDefault(require("../../../controllers/serviceController"));
const auth_1 = require("../../../middlewares/auth");
const buildDepositPlans_1 = __importDefault(require("../../../services/buildDepositPlans"));
/**
    Country-code []
    @method GET
**/
// handle this 
(0, buildDepositPlans_1.default)().then(res => { });
router.get('/getCountryCode', serviceController_1.default.getCountryCode);
/**
    AccountBal []
    @method GET
**/
router.get("/getAccountBalance", auth_1.UserAuth, serviceController_1.default.getAccountBalance);
/**
    Depost-plan []
    @method GET
**/
// This are all the user's plan and can only be changed by the admin
router.get('/getDepositPlans', auth_1.UserAuth, serviceController_1.default.getDepositPlans);
//  this are active plans, which means it has to be pending or on hold by the client.1
router.get('/getActiveDeposit', auth_1.UserAuth, serviceController_1.default.getActiveDeposit);
router.get('/getActiveWithdrawal', auth_1.UserAuth, serviceController_1.default.getActiveWithdrawal);
/**
    Depost []
    @method POST
**/
router.post("/newDepositRequest", auth_1.UserAuth, serviceController_1.default.newDepositRequest);
router.get("/getAllDepositRequest", auth_1.UserAuth, serviceController_1.default.getAllDepositRequest);
router.get("/getAllSuccessfulInvesment", auth_1.UserAuth, serviceController_1.default.getAllSuccessfulInvesment);
/**
    Withdrawal []
    @method POST
**/
router.post("/newWithdrawalRequest", auth_1.UserAuth, serviceController_1.default.newWithdrawalRequest);
module.exports = router;
