import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';



class compoundingPlans extends Model {}

export interface compoundingPlanInterface<T> {
    id: T,
    uuid: T,
    plan: T,
    minAmt: T,
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
      modelName: 'compoundingPlan',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })


export default compoundingPlans;

