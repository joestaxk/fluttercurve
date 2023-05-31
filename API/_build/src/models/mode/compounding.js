"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class userCompounding extends sequelize_1.Model {
}
userCompounding.init({
    totalDeposit: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    totalWithdrawal: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    },
    userUuid: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    totalEarning: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'Compounding',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = userCompounding;
