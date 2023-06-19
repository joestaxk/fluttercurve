import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
// import httpStatus from 'http-status';
// import ApiError from '../../utils/ApiError';
// import helpers from '../../utils/helpers';
import userDeposit from './deposit';
import userWithdrawal from './withdrawal';


class userAccount extends Model {}

export interface userAccountInterface<T> {
    id: T,
    uuid: T,
    totalWithdrawal: T,
    totalDeposit: T,
    totalEarning: T
}

userAccount.init({
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
      modelName: 'userAccount',
      timestamps: true,
      updatedAt: 'updateTimestamp'
})




export default userAccount;

