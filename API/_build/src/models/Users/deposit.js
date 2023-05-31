"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class userDeposit extends sequelize_1.Model {
}
userDeposit.init({
    clientId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    chargeID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    plan: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    intrestRate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    investedAmt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    progressAmt: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    remainingDays: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    investmentCompleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: "false"
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'Deposit',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = userDeposit;
