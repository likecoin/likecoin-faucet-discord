import Cosmos from '@oraichain/cosmosjs';
import Config from '../config/config';
import { TransactionResponse } from '../models/cosmos/message';

interface CosmosClient {
  distribute: (address: string) => Promise<TransactionResponse>;
  checkAccount: (address: string) => Promise<boolean>;
}

const CosmosClient = (): CosmosClient => {
  const client = new Cosmos(Config.faucet.restUrl, Config.faucet.chainId);
  client.setBech32MainPrefix('cosmos');

  const message = Cosmos.message;

  const accountKey = client.getChildKey(Config.faucet.mnemonic);
  const faucetAccount = client.getAddress(accountKey);

  const checkAccount = async (address: string): Promise<boolean> => {
    const res = await client.getAccounts(address);
    return !!res['account'];
  };

  const distribute = async (address: string): Promise<TransactionResponse> => {
    const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
      from_address: faucetAccount,
      to_address: address,
      amount: [
        { denom: Config.faucet.denom, amount: Config.faucet.amount.toString() },
      ],
    });

    const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgSend',
      value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish(),
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo: '',
    });

    return client.submit(accountKey, txBody, 'BROADCAST_MODE_BLOCK', [0]);
  };

  return { distribute, checkAccount };
};

export default CosmosClient;
