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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const db_1 = require("../../database/db");
class Referral extends sequelize_1.default.Model {
}
Referral.init({
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    firstDeposit: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
    },
    ClientUuid: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    ClientId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Clients",
            key: "id",
        },
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'Referral',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = Referral;
