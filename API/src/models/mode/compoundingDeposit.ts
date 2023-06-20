import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class  compoundingDeposit extends Model {}

export interface DepositInterface<T> {
    id: T,
    userId: T,
    plan: T,
    amount: T,
    status: T
}

 compoundingDeposit.init({
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    chargeID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: "compounding"
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
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
        defaultValue: 0
    },
    investmentCompleted :{
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
      modelName: 'compoundingDeposit',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })


export default  compoundingDeposit;

