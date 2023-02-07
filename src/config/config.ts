import dotenv from 'dotenv';
import { ApplicationConfig } from '../models/config';

dotenv.config();

const config: ApplicationConfig = {
  env: process.env.ENV!,
  discordToken: process.env.DISCORD_TOKEN ?? '',
  channelId: process.env.CHANNEL_ID ?? '',
  faucet: {
    cooldownInDay: process.env.FAUCET_COOLDOWN_IN_DAY 
      ? parseInt(process.env.FAUCET_COOLDOWN_IN_DAY, 10)
      : 365,
    addressPrefix: process.env.FAUCET_ADDRESS_PREFIX ?? 'cosmos',
    mnemonic: process.env.FAUCET_MNEMONIC ?? '',
    chainId: process.env.FAUCET_CHAIN_ID ?? '',
    restUrl: process.env.FAUCET_REST_URL ?? '',
    denom: process.env.FAUCET_DENOM ?? 'nanolike',
    amount: process.env.FAUCET_AMOUNT
      ? parseInt(process.env.FAUCET_AMOUNT, 10)
      : 1000000000,
    fee: process.env.FAUCET_FEE ?? '20000000',
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    database: process.env.DB_NAME ?? 'faucet_discord',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '',
  },
};

export default config;
