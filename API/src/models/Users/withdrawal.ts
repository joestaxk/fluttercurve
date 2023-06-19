import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import helpers from '../../utils/helpers';


class userWithdrawal extends Model {}

export interface WithdrawalInterface<T> {
    id: T,
    uuid: T,
    plan: T,
    amount: T,
    status: T
}

userWithdrawal.init({
    userId: {
        type: DataTypes.UUID,
        allowNull:false,
    },
    walletAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    mode: {
        type: DataTypes.ENUM("normal", "compounding"),
        allowNull: false,
        defaultValue: "normal"
    },
    status: {
        type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
        allowNull: false,
        defaultValue: "PENDING"
    }
  },
  {
      sequelize,
      modelName: 'Withdrawal',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    



export default userWithdrawal;

