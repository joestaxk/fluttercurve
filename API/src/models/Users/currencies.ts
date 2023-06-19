import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class userCurrency extends Model {}

export interface userCurrenciesInterface<T> {
    id: T,
    uuid: T,
    totalWithdrawal: T,
    totalDeposit: T,
}

userCurrency.init({
    currency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
  },
  {
      sequelize,
      modelName: 'userCurrency',
      timestamps: true,
      updatedAt: 'updateTimestamp'
})




export default userCurrency;

