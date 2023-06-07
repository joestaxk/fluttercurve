import Sequelize, {DataTypes} from 'sequelize';
import { sequelize } from '../../database/db';
// import Referral from './referrals';


class userAvatar extends Sequelize.Model {}

export interface userAvatarInterface<T> {
    id: T;
    avatar: T
}

userAvatar.init({
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
      sequelize,
      modelName: 'userAvatar',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    

export default userAvatar;

