import dotenv from 'dotenv';
import { ApplicationConfig } from '../models/config';

dotenv.config();

const config: ApplicationConfig = {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  channelId: process.env.CHANNEL_ID ?? '',
  faucet: {
    prefix: process.env.FAUCET_TOKEN_PREFIX ?? 'cosmos',
    mnemonic: process.env.FAUCET_MNEMONIC ?? '',
    chainId: process.env.FAUCET_CHAIN_ID ?? '',
    restUrl: process.env.FAUCET_REST_URL ?? '',
    denom: process.env.FAUCET_DENOM ?? 'nanolike',
    amount: process.env.FAUCET_AMOUNT
      ? parseInt(process.env.FAUCET_AMOUNT, 10)
      : 1000000000,
  },
};

export default config;
