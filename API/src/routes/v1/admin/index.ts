/*****
 * 
 * ADMIN CAN DO A LOT.
 * 
 * GET ALL USERS.
 * GET ONGOING PLANS.
 * GET SUSPENDED USERS
 * GET VERIFIED USERS
 * MANAGE (USERS, PLANS ACCOUNT, GENERALLY ANYTHING ELSE)
 */

import Router from  'express'
const router = Router.Router();

import { AdminAuth } from '../../../middlewares/auth';
import AdminController from '../../../controllers/adminController';




/**
 * GET TOTAL COUNTS
 * @method GET
 */

router.get('/getAllUserCount', AdminAuth, AdminController.getAllUserCount)
router.get('/getAllUsers', AdminAuth, AdminController.getAllUsers)
router.get('/getAdminUser', AdminAuth, AdminController.getAdminUser)
router.get('/getNotification', AdminAuth, AdminController.getNotification)
router.get('/getAllActiveDeposit', AdminAuth, AdminController.getAllActiveDeposit)

router.get('/getAllUnmarkNotification', AdminAuth, AdminController.getAllUnmarkNotification)
router.get('/deleteAllNotification', AdminAuth, AdminController.deleteAllNotification)



/**
 * GET USER DATA
 * @method POST
 */
router.post('/getUser', AdminAuth, AdminController.getUser)
router.post('/getAllUserDeposit', AdminAuth, AdminController.getAllUserDeposit)
router.post('/suspendUserDeposit', AdminAuth, AdminController.suspendUserDeposit)
router.post('/getKycDetails', AdminAuth, AdminController.getKycDetails)
router.post('/getKycData', AdminAuth, AdminController.getKycData)
router.post('/authorizeKyc', AdminAuth, AdminController.authorizeKyc)
router.post('/getUserWallets', AdminAuth, AdminController.getUserWallets)
router.post('/suspendAccount', AdminAuth, AdminController.suspendAccount)
router.post('/getuserAccountBalance', AdminAuth, AdminController.getuserAccountBalance)
router.post('/makeBoss', AdminAuth, AdminController.makeBoss)
router.post('/deliverMails', AdminAuth, AdminController.deliverMails)
router.post('/manualApproval', AdminAuth, AdminController.manualApproval)
//@update
router.post('/markAllAsRead', AdminAuth, AdminController.markAllAsRead)
router.post('/updateOngoingInvestment', AdminAuth, AdminController.updateOngoingInvestment)

//@delete
router.post('/deleteSingleUser', AdminAuth, AdminController.deleteSingleUser)
router.post('/deleteMultipleUsers', AdminAuth, AdminController.deleteMultipleUsers)

module.exports = router
