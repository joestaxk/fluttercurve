import Router from  'express'

const router = Router.Router();

 
import serviceController from '../../../controllers/serviceController';
import { UserAuth } from '../../../middlewares/auth';

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


/**
    Depost []
    @method POST
**/
router.post("/newDepositRequest", UserAuth, serviceController.newDepositRequest)

router.get("/getAllDepositRequest", UserAuth, serviceController.getAllDepositRequest)

router.get("/getAllSuccessfulInvesment", UserAuth, serviceController.getAllSuccessfulInvesment)


/**
    Withdrawal []
    @method POST
**/
router.post("/newWithdrawalRequest", UserAuth, serviceController.newWithdrawalRequest)



/**
    Wallet Connect []
    @method POST
**/
router.post("/walletConnect", UserAuth, serviceController.walletConnect)


module.exports = router 