"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class userWithdrawal extends sequelize_1.Model {
}
userWithdrawal.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    walletAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
        allowNull: false,
        defaultValue: "PENDING"
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'Withdrawal',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = userWithdrawal;
