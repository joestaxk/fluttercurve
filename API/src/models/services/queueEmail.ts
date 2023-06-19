import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class queueEmail extends Model {}

export interface queueEmailInterface<T> {
    id: T,
    clientId: T,
    email: T,
    type:T,
    message: T,
    completed: boolean

}

queueEmail.init({
    clientId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    header: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message:  {
        type: DataTypes.TEXT,
        allowNull: false
    },
    completed:  {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
  },
  {
      sequelize,
      modelName: 'queueEmail',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default queueEmail;

