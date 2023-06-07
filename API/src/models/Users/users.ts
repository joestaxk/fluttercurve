import Sequelize, {DataTypes, Model, UUIDV1 } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import helpers from '../../utils/helpers';
import userAccount from './userAccount';
import Referral from './referrals';
import userCompounding from '../mode/compounding';
import Kyc from './kyc';
// import Referral from './referrals';


class Client extends Sequelize.Model {}

export interface ClientInterface<T> {
    userAccount: any,
    Compounding: any,
    Referrals: any,
    id: T,
    uuid: T,
    fullName: T,
    userName: T,
    email: T, 
    phoneNumber: T,
    country: T,
    annualIncome: T,
    currency: T,
    referral: T,
    password:T,
    isAdmin: Boolean,
    tokens: string,
    token: T,
    isVerified: Boolean,
    isKyc: Boolean,
    isBlacklisted: Boolean,
    avatar: T
}

Client.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
           isEmail: true,
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    annualIncome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    referral: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tokens: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
      sequelize,
      modelName: 'Client',
      timestamps: true,
      updatedAt: 'updateTimestamp'
  })    


Client.beforeCreate(
    // Hash password before saving
     async function(user:any, options) {
        try {
            const hashPassword = await helpers.hashPassword(user.password)
            user.password = hashPassword
        } catch (error) {
            throw new ApiError("Bcrypt error", httpStatus.BAD_REQUEST,  error)
        }
    }
)

Client.hasOne(userAccount)
userAccount.belongsTo(Client)


Client.hasOne(userCompounding)
userCompounding.belongsTo(Client)

Client.hasMany(Referral, {
    foreignKey: "ClientId"
});
Referral.belongsTo(Client)

Client.hasOne(Kyc)
Kyc.belongsTo(Client)



export default Client;

