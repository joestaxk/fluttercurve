import Sequelize, {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import Client from './users';


class Referral extends Sequelize.Model {}

export interface referralInterface<T> {
    id: T,
    uuid: T,
}

Referral.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstDeposit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    ClientUuid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ClientId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Clients",
            key: "id", 
        },
    }
  },
  {
      sequelize,
      modelName: 'Referral',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default Referral;

