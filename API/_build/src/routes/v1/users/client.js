"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const user_1 = __importDefault(require("../../../controllers/clientController/user"));
const auth_1 = require("../../../middlewares/auth");
/**
    GENERATE TOKEN - PROTECTED
    @method post
**/
router.post('/refresh', auth_1.UserAuth, user_1.default.getRefreshToken);
/**
    Verify User Account - UNPROTECTED
    @method GET
**/
router.get('/verifyUserAccount', user_1.default.verifyUserAccount);
/**
    GET USER- PROTECTED
    @method GET
 **/
router.get("/me", auth_1.UserAuth, user_1.default.getMe);
/**
    GET USER- PROTECTED
    @method GET
 **/
router.get("/getReferredUser", auth_1.UserAuth, user_1.default.getReferredUser);
/**
    Logout - PROTECTED
    @method POST
**/
router.post("/logout", auth_1.UserAuth, user_1.default.logout);
/**
    UPDATE PASSWORD
   @method POST
**/
router.post("/updatePasswordByLink", user_1.default.updatePasswordByLink);
/**
    UPDATE PASSWORD FROM auth user
   @method UPDATE
**/
router.post("/updatePassword", auth_1.UserAuth, user_1.default.updatePassword);
/**
    UPDATE USER-INFO FROM auth user
   @method UPDATE
**/
router.post("/updateUserInfo", auth_1.UserAuth, user_1.default.updateUserInfo);
// ------------------------------------------------ AVATAR
//------------------------------------------------- AVATAR
/**
    UPDATE Avatar
   @method POST
**/
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/private/users');
    },
    filename: function (req, file, cb) {
        const fileName = `${req.id}.${file.originalname.split('.').pop()}`;
        const filePath = `./public/private/users/${fileName}`;
        // Remove existing file if it exists
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        cb(null, fileName);
    }
});
const upload = (0, multer_1.default)({ storage });
router.post("/uploadAvatar", auth_1.UserAuth, upload.single('avatar'), user_1.default.uploadAvatar);
// ------------------------------------------------ KYC
//------------------------------------------------- KYC
/**
    setup KYC
   @method POST

   **/
const storageKyc = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.id; // Assuming req.id contains the user ID
        const destinationPath = `./public/private/kyc/${userId}`;
        // Create the user's folder if it doesn't exist
        if (!fs_1.default.existsSync(destinationPath)) {
            fs_1.default.mkdirSync(destinationPath, { recursive: true });
        }
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const userId = req.id; // Assuming req.id contains the user ID
        const fileName = file.originalname.replace(/^[a-z0-9]+[.]+$/i, '');
        const filePath = path_1.default.join('./public/private/kyc', userId, fileName);
        // Remove existing file if it exists
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        cb(null, fileName);
    }
});
const fileFilter = function (req, file, cb) {
    if (file.fieldname === 'frontID' || file.fieldname === 'backID') {
        // Validate image files for frontID and backID fields
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
    }
    else if (file.fieldname === 'livevideo') {
        // Validate video file for livevideo field
        if (!file.mimetype.startsWith('video/') || file.size > 5 * 1024 * 1024) {
            return cb(new Error('Only videos up to 5MB are allowed!'));
        }
    }
    cb(null, true);
};
const uploadKyc = (0, multer_1.default)({
    storage: storageKyc,
    fileFilter: fileFilter
});
router.post('/uploadKyc', auth_1.UserAuth, uploadKyc.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'frontID', maxCount: 1 },
    { name: 'backID', maxCount: 1 },
    { name: 'livevideo', maxCount: 1 }
]), user_1.default.setupKyc);
module.exports = router;
