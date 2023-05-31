import Router from  'express'

const router = Router.Router();
import multer from 'multer';

import userController from '../../../controllers/clientController/user'
import { UserAuth } from '../../../middlewares/auth';

/**
    Verify User Account - UNPROTECTED
    @method GET
**/
router.get('/verifyUserAccount', userController.verifyUserAccount);

/** 
    GET USER- PROTECTED
    @method GET
 **/

router.get("/me", UserAuth, userController.getMe)


/** 
    GET USER- PROTECTED
    @method GET
 **/

    router.get("/getReferredUser", UserAuth, userController.getReferredUser)


/**
    Logout - PROTECTED
    @method POST
**/
router.post("/logout", UserAuth, userController.logout)

/**
    UPDATE PASSWORD
   @method POST
**/
router.post("/updatePassword", userController.updatePasswordByLink)

/**
    UPDATE Avatar
   @method POST
**/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
      cb(null,  './public/private/users')
    },
    filename: function (req:any, file, cb) {
      cb(null, req.id+ file.originalname.replace(/^[a-z0-9]+[.]+$/i, ''))
    }
  })
  
const upload = multer({ storage })

router.post("/uploadAvatar", UserAuth, upload.single('avatar'),  userController.uploadAvatar)

module.exports = router

