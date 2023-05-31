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
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
class Client extends sequelize_1.Model {
}
Client.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    annualIncome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    referral: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBlacklisted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tokens: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'Client',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
Client.beforeCreate(
// Hash password before saving
function (user, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashPassword = yield helpers_1.default.hashPassword(user.password);
            user.password = hashPassword;
        }
        catch (error) {
            throw new ApiError_1.default("Bcrypt error", http_status_1.default.BAD_REQUEST, error);
        }
    });
});
exports.default = Client;
