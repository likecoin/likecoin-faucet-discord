import { Interval } from 'limiter';

export interface ApplicationConfig {
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
  };
}
