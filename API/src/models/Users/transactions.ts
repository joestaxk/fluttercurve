import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class userTransaction extends Model {}

export interface transactionInterface<T> {
    id: T,
    uuid: T,
    invoiceID: T,
    amount: T,
    mode: "normal"|"compounding"
    status: T,
}

userTransaction.init({
    userId: {
        type: DataTypes.UUID,
        allowNull:false,
    },
    invoiceID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("deposit", "withdrawal"),
        allowNull: false,
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
        defaultValue: "PENDING"
    }
  },
  {
      sequelize,
      modelName: 'transaction',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    



export default userTransaction;

