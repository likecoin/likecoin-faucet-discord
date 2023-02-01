import { Sequelize, Model, DataTypes } from 'sequelize';
import Config from '../config/config';

const sequelize = new Sequelize(Config.db.database, Config.db.user, Config.db.password, {
  dialect: 'postgres',
});

export class User extends Model {}

User.init({
  username: {
    type: DataTypes.STRING,
  },
  discordId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
});

export class Drop extends Model {}

Drop.init({
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Drop',
});

export async function initDB(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
}
