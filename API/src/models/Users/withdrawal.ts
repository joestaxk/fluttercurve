import Sequelize, {DataTypes, Model } from 'sequelize';
import { sequelize } from "../../database/db";
import userTransaction from "./transactions";

class userWithdrawal extends Sequelize.Model {}

export interface WithdrawalInterface<T> {
  id: T;
  uuid: T;
  plan: T;
  amount: T;
  status: T;
}

userWithdrawal.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    mode: {
      type: DataTypes.ENUM("normal", "compounding"),
      allowNull: false,
      defaultValue: "normal",
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "Withdrawal",
    timestamps: true,
    updatedAt: "updateTimestamp",
  }
);

// user deposit
userWithdrawal.hasOne(userTransaction, {
  foreignKey: {
    name: "withdrawalId",
    allowNull: false,
  },
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

userTransaction.belongsTo(userWithdrawal, {
  foreignKey: {
    name: "withdrawalId",
    allowNull: false,
  },
  targetKey: "id"
});


export default userWithdrawal;
