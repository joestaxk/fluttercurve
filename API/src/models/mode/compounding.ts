import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

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
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    totalWithdrawal: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    totalEarning: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
  },
  {
      sequelize,
      modelName: 'userCompounding',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default userCompounding;

