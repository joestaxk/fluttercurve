"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const sequelize_1 = __importStar(require("sequelize"));
const db_1 = require("../../database/db");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
const userAccount_1 = __importDefault(require("./userAccount"));
const referrals_1 = __importDefault(require("./referrals"));
const compounding_1 = __importDefault(require("../mode/compounding"));
// import Referral from './referrals';
class Client extends sequelize_1.default.Model {
}
Client.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
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
    currency: {
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
    referralImage: {
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
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
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
Client.hasOne(userAccount_1.default);
userAccount_1.default.belongsTo(Client);
Client.hasOne(compounding_1.default);
compounding_1.default.belongsTo(Client);
Client.hasMany(referrals_1.default, {
    foreignKey: "ClientId"
});
referrals_1.default.belongsTo(Client);
exports.default = Client;
