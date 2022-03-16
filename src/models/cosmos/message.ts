export interface TransactionResponse {
  tx_response: {
    code: number;
    height: string;
    txhash: string;
    raw_log: string;
  };
}
