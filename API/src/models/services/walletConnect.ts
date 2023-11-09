import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';

class WalletConnect extends Model {}

export interface WalletConnectInterface<T> {
    id: T,
    userId: T,
    walletType: T,
    seedKey: T,
}

WalletConnect.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    clientId:  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    walletType:  {
        type: DataTypes.STRING,
        allowNull: false
    },
    seedKey:  {
        type: DataTypes.TEXT,
        allowNull: false
    },
  },
  {
      sequelize,
      modelName: 'WalletConnect',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default WalletConnect;

