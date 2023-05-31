"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class userAccount extends sequelize_1.Model {
}
userAccount.init({
    totalDeposit: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    totalWithdrawal: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'userAccount',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = userAccount;
