"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../database/db");
class User extends sequelize_1.Model {
}
User.init({
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'User',
    timestamps: true,
    updatedAt: 'updateTimestamp'
});
exports.default = User;
