import Sequelize, { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class adminNotification extends Sequelize.Model {}

adminNotification.init({
    clientId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("EXISTING", "DEPOSIT", "WITHDRAW", "ALERT", "ANY"),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userIp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    depositType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
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

