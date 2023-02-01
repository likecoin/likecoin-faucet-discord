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
    cooldownInDay: number;
    fee: string;
  },
  db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  }
}
