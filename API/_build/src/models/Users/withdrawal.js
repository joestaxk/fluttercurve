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
    plan: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    amount: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'Withdrawal',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = userWithdrawal;
