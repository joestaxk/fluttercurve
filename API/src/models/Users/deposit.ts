import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import helpers from '../../utils/helpers';
import DepositPlan from '../services/depositPlans';


class userDeposit extends Model {}

export interface DepositInterface<T> {
    id: T,
    userId: T,
    plan: T,
    amount: T,
    status: T
}

userDeposit.init({
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    chargeID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    intrestRate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    investedAmt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    progressAmt:  {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    remainingDays: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    investmentCompleted :{
        type: DataTypes.BOOLEAN,
        defaultValue: "false"
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
  },
  {
      sequelize,
      modelName: 'Deposit',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })


export default userDeposit;

