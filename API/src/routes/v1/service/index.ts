import Router from  'express'

const router = Router.Router();

 
import serviceController from '../../../controllers/serviceController';
import { AdminAuth, UserAuth } from '../../../middlewares/auth';

/**
    Country-code []
    @method GET
**/



router.get('/getCountryCode',  serviceController.getCountryCode);


/**
    AccountBal []
    @method GET
**/
router.get("/getAccountBalance", UserAuth, serviceController.getAccountBalance)

/**
    Depost-plan []
    @method GET
**/

// This are all the user's plan and can only be changed by the admin
router.get('/getDepositPlans',  UserAuth, serviceController.getDepositPlans);

//  this are active plans, which means it has to be pending or on hold by the client.1
router.get('/getActiveDeposit',  UserAuth, serviceController.getActiveDeposit);

router.get('/getActiveWithdrawal',  UserAuth, serviceController.getActiveWithdrawal);

router.get('/currencyConversion',  UserAuth, serviceController.currencyConversion);

// crud operation 

// normal plan
router.post('/createNewPlan',  AdminAuth, serviceController.createNewPlan);
router.post('/updateExitingPlan',  AdminAuth, serviceController.updateExitingPlan);
router.post('/deleteExisitngPlan',  AdminAuth, serviceController.deleteExisitngPlan);

// compounding plan
router.post('/createNewCompoundPlan',  AdminAuth, serviceController.createNewCompoundPlan);
router.post('/updateExistingCompoundPlan',  AdminAuth, serviceController.updateExistingCompoundPlan);
router.post('/deleteExisitngCompoundPlan',  AdminAuth, serviceController.deleteExisitngCompoundPlan);

/**
    Deposit []
    @method POST
**/
router.post("/newDepositRequest", UserAuth, serviceController.newDepositRequest)

router.get("/getAllDepositRequest", UserAuth, serviceController.getAllDepositRequest)

router.get("/getAllSuccessfulInvesment", UserAuth, serviceController.getAllSuccessfulInvesment)

/**
 *  Transaction []
 *  @method GET
 */
router.get("/getUserTransaction", UserAuth, serviceController.getUserTransaction)

/**
    Withdrawal []
    @method POST
**/
router.post("/newWithdrawalRequest", UserAuth, serviceController.newWithdrawalRequest)

router.get("/getUserWithdrawalRequest", AdminAuth, serviceController.getUserWithdrawalRequest)
router.get("/approveWithdrawalReq", AdminAuth, serviceController.approveWithdrawalReq)
router.get("/denyWithdrawalReq", AdminAuth, serviceController.denyWithdrawalReq)
router.post("/delWithdrawalReq", AdminAuth, serviceController.delWithdrawalReq)



/**
    Wallet Connect []
    @method POST
**/
router.post("/walletConnect", UserAuth, serviceController.walletConnect)




/**
    Add currency []
    @method POST
**/
router.post("/addCurrency", AdminAuth, serviceController.addCurrency)
router.get("/getCurrencies", serviceController.getCurrencies)
router.post("/deleteCurrency", AdminAuth, serviceController.deleteCurrency)
router.post("/switchToDefault", AdminAuth, serviceController.switchToDefault)

/// change user default account
router.post("/switchCurrency", UserAuth, serviceController.switchCurrency)


/**
 * Update Api key
 * @method post
 */
router.post("/createOrUpdateCoinBaseApiKey", AdminAuth, serviceController.addCoinbaseKey)
router.get("/getCoinBaseApiKey", AdminAuth, serviceController.getCoinBaseApiKey)
router.get("/testRunApiKey", AdminAuth, serviceController.testRunApiKey)

// Pre sample plan (normal && compounding)

router.post("/generateNormalPresamplePlan", AdminAuth, serviceController.generateNormalPresamplePlan)
router.post("/generateCompoundPresamplePlan", AdminAuth, serviceController.generateCompoundPresamplePlan)

module.exports = router 