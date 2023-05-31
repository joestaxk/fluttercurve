import Router from  'express'

const router = Router.Router();

 
import serviceController from '../../../controllers/serviceController';
import { UserAuth } from '../../../middlewares/auth';
import buildDepositPlans from '../../../services/buildDepositPlans';

/**
    Country-code []
    @method GET
**/

// handle this 
buildDepositPlans().then(res => {})

router.get('/getCountryCode',  serviceController.getCountryCode);

/**
    Depost-plan []
    @method GET
**/

// This are all the user's plan and can only be changed by the admin
router.get('/getDepositPlans',  UserAuth, serviceController.getDepositPlans);

//  this are active plans, which means it has to be pending or on hold by the client.1
router.get('/getActiveDeposit',  UserAuth, serviceController.getActiveDeposit);

/**
    Depost []
    @method POST
**/
router.post("/newDepositRequest", UserAuth, serviceController.newDepositRequest)

router.get("/getAllDepositRequest", UserAuth, serviceController.getAllDepositRequest)

router.get("/getAllSuccessfulInvesment", UserAuth, serviceController.getAllSuccessfulInvesment)

module.exports = router