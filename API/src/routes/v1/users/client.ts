import Router from  'express'
import fs from 'fs'
import  path from 'path';


const router = Router.Router();
import multer from 'multer';

import userController from '../../../controllers/clientController/user'
import { UserAuth } from '../../../middlewares/auth';
require
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
router.post("/updatePasswordByLink", userController.updatePasswordByLink)


/**
    UPDATE PASSWORD FROM auth user
   @method UPDATE
**/
router.post("/updatePassword", UserAuth, userController.updatePassword)

/**
    UPDATE USER-INFO FROM auth user
   @method UPDATE
**/
router.post("/updateUserInfo", UserAuth, userController.updateUserInfo)





// ------------------------------------------------ AVATAR
//------------------------------------------------- AVATAR
/**
    UPDATE Avatar
   @method POST
**/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/private/users');
  },
  filename: function (req: any, file, cb) {
    const fileName = `${req.id}.${file.originalname.split('.').pop()}`;
    const filePath = `./public/private/users/${fileName}`;

    // Remove existing file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, fileName);
  }
});

const upload = multer({ storage });

router.post("/uploadAvatar", UserAuth, upload.single('avatar'),  userController.uploadAvatar)


// ------------------------------------------------ KYC
//------------------------------------------------- KYC
/**
    setup KYC
   @method POST

   **/

const storageKyc = multer.diskStorage({
  destination: function (req:any, file, cb) {
    const userId = req.id; // Assuming req.id contains the user ID
    const destinationPath = `./public/private/kyc/${userId}`;

    // Create the user's folder if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },

  filename: function (req:any, file, cb) {
    const userId = req.id; // Assuming req.id contains the user ID
    const fileName = file.originalname.replace(/^[a-z0-9]+[.]+$/i, '');
    const filePath = path.join('./public/private/kyc', userId, fileName);

    // Remove existing file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, fileName);
  }
});

const fileFilter = function (req:any, file:any, cb: (arg0:any, arg1?: boolean) => any) {
  if (file.fieldname === 'frontID' || file.fieldname === 'backID') {
    // Validate image files for frontID and backID fields
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
  } else if (file.fieldname === 'livevideo') {
    // Validate video file for livevideo field
    if (!file.mimetype.startsWith('video/') || file.size > 5 * 1024 * 1024) {
      return cb(new Error('Only videos up to 5MB are allowed!'));
    }
  }
  cb(null, true);
};

const uploadKyc = multer({
  storage: storageKyc,
  fileFilter: fileFilter
});

router.post('/uploadKyc', UserAuth, uploadKyc.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'frontID', maxCount: 1 },
  { name: 'backID', maxCount: 1 },
  { name: 'livevideo', maxCount: 1 }
]), userController.setupKyc);


module.exports = router

