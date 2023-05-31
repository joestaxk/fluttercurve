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
    plan: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    amount: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false
    }
  },
  {
      sequelize,
      modelName: 'Withdrawal',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    



export default userWithdrawal;

