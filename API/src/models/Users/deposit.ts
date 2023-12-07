import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import userTransaction from './transactions';

class userDeposit extends Model {}

export interface DepositInterface<T> {
    id: T,
    userId: T,
    plan: T,
    amount: T,
    status: T,
    investmentCompleted: boolean
}

userDeposit.init({
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: "normal"
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.DECIMAL,
        defaultValue: "0"
    },
    
    remainingDays: {
        type: DataTypes.DECIMAL,
        defaultValue: "1"
    },
    investmentCompleted :{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    suspended :{
        type: DataTypes.BOOLEAN,
        defaultValue: false
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



// user deposit
userDeposit.hasOne(userTransaction, {
    onUpdate: "CASCADE",
    foreignKey: {
      name: "depositId",
      allowNull: false,
    },
  });

  userTransaction.belongsTo(userDeposit, {
    foreignKey: {
      name: "depositId",
      allowNull: false,
    },
  });

export default userDeposit;

