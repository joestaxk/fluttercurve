import Router from  'express'

const router = Router.Router();

 
import compoundingController from '../../../controllers/compoundingController';
import { UserAuth } from '../../../middlewares/auth';
import { buildCompondingPlans } from '../../../services/buildDepositPlans';


buildCompondingPlans().then(res => {})

/**
   Make Investment
    @method POST
**/

router.post('/makeInvestment', UserAuth, compoundingController.makeInvestment);

/**
   GET Investment
    @method GET
**/
router.get('/getCompoundingPlans', UserAuth, compoundingController.getCompoundingPlans);



/**
   GET Investment
    @method GET
**/
router.get('/getACompoundingPlans', UserAuth, compoundingController.getACompoundingPlans);

router.get('/getAllCompoundingDepositRequest', UserAuth, compoundingController.getAllCompoundingDepositRequest);

router.get('/getAllCompoundingSuccessfulInvesment', UserAuth, compoundingController.getAllCompoundingSuccessfulInvesment);

module.exports = router