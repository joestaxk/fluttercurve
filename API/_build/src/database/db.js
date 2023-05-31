"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("../controllers/adminController/user"));
exports.sequelize = new sequelize_1.Sequelize(config_1.default.DB_NAME, config_1.default.DB_USER, config_1.default.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});
function doThisFirst() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            user_1.default.RegisterAdmin();
            //build deposit plans
            // await buildDepositPlans();
        }
        catch (error) {
            console.log(`Coming from doThisFirst function:-`, error);
        }
    });
}
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.sequelize.authenticate();
            yield exports.sequelize.sync();
            console.log("Connection has been established successfully");
            yield doThisFirst();
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
exports.default = authenticate;
