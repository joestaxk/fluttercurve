import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class DepositPlan extends Model {}

export interface DepositPlanInterface<T> {
    id: T,
    uuid: T,
    plan: T,
    minAmt: T,
    duration: T,
    gurantee: T,
    dailyInterestRate: T,
}

DepositPlan.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    plan: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    minAmt: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    maxAmt: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    duration: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    guarantee: {
        type: DataTypes.STRING,
        defaultValue: "0"
    },
    dailyInterestRate: {
        type: DataTypes.STRING,
        defaultValue: "0"
    }
  },
  {
      sequelize,
      modelName: 'DepositPlan',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default DepositPlan;

