"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../../../controllers/clientController/auth"));
/**
    Register
    @method POST
**/
router.post('/register', auth_1.default.register);
/**
    Login
    @method POST
**/
router.post('/login', auth_1.default.login);
module.exports = router;
