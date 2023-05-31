import Router from  'express'

const router = Router.Router();
 
import authController from '../../../controllers/clientController/auth';

/**
    Register
    @method POST
**/

router.post('/register',  authController.register);

/**
    Login
    @method POST
**/
router.post('/login', authController.login);

/**
   FORGET PASSWORD
   @method POST
**/

router.post("/forgetPassword", authController.forgetPassword)


module.exports = router