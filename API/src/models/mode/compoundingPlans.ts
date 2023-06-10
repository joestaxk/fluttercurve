import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';


class compoundingPlans extends Model {}

export interface compoundingPlansInterface<T> {
    id: T,
    uuid: T,
    plan: T,
    minAmt: T,
    maxAmt: T,
    duration: T,
    gurantee: T,
    interestRate: T,
}

compoundingPlans.init({
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
    interestRate: {
        type: DataTypes.STRING,
        defaultValue: "0"
    }
  },
  {
      sequelize,
      modelName: 'compoundingPlans',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default compoundingPlans;

