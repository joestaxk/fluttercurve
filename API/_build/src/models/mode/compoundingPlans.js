"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class compoundingPlans extends sequelize_1.Model {
}
compoundingPlans.init({
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
    interestRate: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "0"
    }
}, {
    sequelize: db_1.sequelize,
    modelName: 'compoundingPlans',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = compoundingPlans;
