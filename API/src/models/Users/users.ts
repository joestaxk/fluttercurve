import Sequelize, {DataTypes, Model, UUIDV1 } from 'sequelize';
import { sequelize } from '../../database/db';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import helpers from '../../utils/helpers';
import userAccount from './userAccount';
import Referral from './referrals';
import userCompounding from '../mode/compounding';
import userDeposit from './deposit';
import userWithdrawal from './withdrawal';
import Kyc from './kyc';


class Client extends Sequelize.Model {}

export interface ClientInterface<T> {
    userAccount: any,
    userCompounding: any,
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
    isWalletConnect: Boolean,
    isWallet: Boolean,
    isBlacklisted: Boolean,
    oneTimeKeyToken: T,
    ipaddress: T,
    avatar: T,
    updateTimestamp: T
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
    owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isKyc: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "DECLINED"),
        defaultValue: "PENDING"
    },
    isWalletConnect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tokens: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    oneTimeKeyToken: {
        type: DataTypes.TEXT,
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

Client.hasOne(userAccount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
  });
  
  userAccount.belongsTo(Client, {
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
  });


// user deposit
 Client.hasOne(userDeposit, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'userId',
      allowNull: false,
    },
  });
  userDeposit.belongsTo(Client, {
    foreignKey: {
      name: 'userId',
      allowNull: false,
    },
  });


 Client.hasOne(userCompounding, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
  });
  
userCompounding.belongsTo(Client, {
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
});

Client.hasOne(userWithdrawal, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
  });
  
userWithdrawal.belongsTo(Client, {
    foreignKey: {
      name: 'clientId',
      allowNull: false,
    },
});



Client.hasMany(Referral, {
    foreignKey: "ClientId"
});
Referral.belongsTo(Client)


Client.hasOne(Kyc,  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: "userId",
        allowNull: false
    }
})
Kyc.belongsTo(Client, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    }
})

export default Client;

