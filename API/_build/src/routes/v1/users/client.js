"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const user_1 = __importDefault(require("../../../controllers/clientController/user"));
const auth_1 = require("../../../middlewares/auth");
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
        console.log(file);
        cb(null, './public/private/users');
    },
    filename: function (req, file, cb) {
        cb(null, req.id + file.originalname.replace(/^[a-z0-9]+[.]+$/i, ''));
    }
});
const upload = (0, multer_1.default)({ storage });
router.post("/uploadAvatar", auth_1.UserAuth, upload.single('avatar'), user_1.default.uploadAvatar);
module.exports = router;
