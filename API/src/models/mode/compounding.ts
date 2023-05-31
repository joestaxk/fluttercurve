import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import helpers from '../../utils/helpers';
import DepositPlan from '../services/depositPlans';


class userCompounding extends Model {}

export interface DepositInterface<T> {
    id: T,
    uuid: T,
    plan: T,
    amount: T,
    status: T
}

userCompounding.init({
    totalDeposit: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    totalWithdrawal: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    userUuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalEarning: {
        type: DataTypes.STRING,
        defaultValue: "0"
    } 
  },
  {
      sequelize,
      modelName: 'Compounding',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default userCompounding;

