"use strict";
const router = (require('express')).Router();
const userController = require('../../../controllers/adminController/user');
const { ErranderAuth } = require('../../../middlewares/auth');
/**
    Verify User Account
    @method GET
**/
router.get('/verifyUserAccount', userController.verifyUserAccount);
/**
    GET USER- PROTECTED
    @method GET
 **/
router.get("/me", ErranderAuth, userController.getMe);
/**
    Logout - PROTECTED
    @method GET
**/
router.get("/logout", ErranderAuth, userController.logout);
module.exports = router;
