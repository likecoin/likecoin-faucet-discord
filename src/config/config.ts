import dotenv from 'dotenv';
import { Interval } from 'limiter';
import { ApplicationConfig } from '../models/config';

dotenv.config();

const config: ApplicationConfig = {
  env: process.env.ENV!,
  discordToken: process.env.DISCORD_TOKEN ?? '',
  channelId: process.env.CHANNEL_ID ?? '',
  faucet: {
    cooldown: (process.env.FAUCET_COOLDOWN as Interval | undefined) ?? 'day',
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
};

export default config;
