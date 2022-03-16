import { Interval } from 'limiter';

export interface ApplicationConfig {
  env: string;
  discordToken: string;
  channelId: string;
  faucet: {
    mnemonic: string;
    chainId: string;
    restUrl: string;
    denom: string;
    amount: number;
    addressPrefix: string;
    cooldown: Interval;
    fee: string;
  };
}
