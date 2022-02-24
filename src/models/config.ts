export interface ApplicationConfig {
  discordToken: string;
  channelId: string;
  faucet: {
    mnemonic: string;
    chainId: string;
    restUrl: string;
    denom: string;
    amount: number;
    prefix: string;
  };
}
