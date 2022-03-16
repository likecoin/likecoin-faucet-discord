import Cosmos from '@oraichain/cosmosjs';
import Long from 'long';
import Config from '../config/config';
import { TransactionResponse } from '../models/cosmos/message';

interface CosmosClient {
  distribute: (address: string) => Promise<string>;
  checkAccount: (address: string) => Promise<boolean>;
}

const CosmosClient = (): CosmosClient => {
  const client = new Cosmos(Config.faucet.restUrl, Config.faucet.chainId);
  client.setBech32MainPrefix(Config.faucet.addressPrefix);

  const message = Cosmos.message;

  const privKey = client.getECPairPriv(Config.faucet.mnemonic);
  const pubKeyAny = client.getPubKeyAny(privKey);
  const faucetAddress = client.getAddress(Config.faucet.mnemonic);

  const checkAccount = async (address: string): Promise<boolean> => {
    const res = await client.getAccounts(address);
    return !!res['account'];
  };

  const distribute = async (address: string): Promise<string> => {
    const accountData = await client.getAccounts(faucetAddress);

    const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
      from_address: faucetAddress,
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

    const signerInfo = new message.cosmos.tx.v1beta1.SignerInfo({
      public_key: pubKeyAny,
      mode_info: {
        single: {
          mode: message.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
        },
      },
      sequence: accountData.account.sequence,
    });

    const fee = new message.cosmos.tx.v1beta1.Fee({
      amount: [{ denom: Config.faucet.denom, amount: Config.faucet.fee }],
      gas_limit: Long.fromInt(200000),
    });

    const authInfo = new message.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [signerInfo],
      fee: fee,
    });

    const signedTxBytes = client.sign(
      txBody,
      authInfo,
      accountData.account.account_number,
      privKey,
    );

    const res: TransactionResponse = await client.broadcast(
      signedTxBytes,
      'BROADCAST_MODE_BLOCK',
    );

    if (res.tx_response.code !== 0) {
      throw new Error(res.tx_response.raw_log);
    }

    return res.tx_response.txhash;
  };

  return { distribute, checkAccount };
};

export default CosmosClient;
