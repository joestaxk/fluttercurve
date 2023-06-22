import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class adminNotification extends Model {}

adminNotification.init({
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("EXISTING", "DEPOSIT"),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userIp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    depositType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    markAsRead: {
        type: DataTypes.BOOLEAN,
       defaultValue: false
    },
  },
  {
      sequelize,
      modelName: 'adminNotification',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })


export default adminNotification;

