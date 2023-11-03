import {DataTypes, Model } from 'sequelize';
import { sequelize } from '../../database/db';


class generalSettings extends Model {}

export interface generalSettingsInterface<T> {
    id?: T,
    appName: T,
    fixerApiKey: T,
    coinBaseApiKey: T
}

generalSettings.init({
    appName: {
        type: DataTypes.STRING
    },
    fixerApiKey: {
        type: DataTypes.STRING
    },
    coinBaseApiKey: {
        type: DataTypes.STRING
    }
  },
  {
      sequelize,
      modelName: 'generalSetting',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })

export default generalSettings;