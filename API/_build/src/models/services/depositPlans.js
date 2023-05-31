"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class DepositPlan extends sequelize_1.Model {
}
DepositPlan.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    plan: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    minAmt: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    maxAmt: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    duration: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    guarantee: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    dailyInterestRate: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'DepositPlan',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = DepositPlan;
