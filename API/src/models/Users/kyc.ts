import Sequelize, {DataTypes, Model, UUIDV1 } from 'sequelize';
import { sequelize } from '../../database/db';

class Kyc extends Sequelize.Model {}

export interface KycInterface<T> {
    id: T,
    uuid: T,
    fullName: T,
    passport: T,
    idType: T,
    frontID: T,
    backID: T,
    livevideo: T,
    dob: T,
    nationality: T,
    isKyc: Boolean,
}

Kyc.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passport: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idType: {
        type: DataTypes.STRING,
        allowNull: false,
     },
    frontID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    backID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    livevideo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isKyc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
  },
  {
      sequelize,
      modelName: 'Kyc',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    

export default Kyc;

