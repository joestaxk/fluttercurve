import Sequelize, {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import userWithdrawal from './withdrawal';
import userDeposit from './deposit';

class userTransaction extends Sequelize.Model {}

export interface transactionInterface<T> {
    id: T,
    uuid: T,
    invoiceID: T,
    amount: T,
    mode: "normal"|"compounding"
    status: T,
    withdrawalId: number,
    depositId: number,
}

userTransaction.init({
    userId: {
        type: DataTypes.UUID,
        allowNull:false,
    },
    withdrawalId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    depositId: {
        type: DataTypes.INTEGER,
        allowNull: true
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

