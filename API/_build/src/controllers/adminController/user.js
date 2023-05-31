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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const users_1 = __importDefault(require("../../models/Users/users"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
class ADMIN_CONTROLLER {
    static RegisterAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const getDATA = config_1.default.ADMIN;
            try {
                const isAdmin = yield users_1.default.findOne({ where: { username: getDATA.userName } });
                if (!isAdmin) {
                    // create one
                    const iamadmin = yield users_1.default.create(getDATA);
                    iamadmin.save();
                }
            }
            catch (error) {
                throw new ApiError_1.default("Admin error", http_status_1.default.BAD_REQUEST, error);
            }
        });
    }
}
exports.default = ADMIN_CONTROLLER;
