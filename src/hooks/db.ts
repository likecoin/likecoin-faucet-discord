import { Sequelize, Model, DataTypes } from 'sequelize';
import Config from '../config/config';

export const sequelize = new Sequelize(Config.db.database, Config.db.user, Config.db.password, {
  dialect: 'postgres',
  host: Config.db.host,
  port: Config.db.port,
});

export class Drop extends Model {}

Drop.init({
  username: {
    type: DataTypes.STRING,
  },
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
