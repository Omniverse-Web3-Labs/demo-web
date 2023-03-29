export const ftAbi = [{
  inputs: [
    {
      internalType: 'bytes',
      name: '_pk',
      type: 'bytes',
    },
  ],
  name: 'getTransactionCount',
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256',
    },
  ],
  stateMutability: 'view',
  type: 'function',
}] as const;

export const nftAbi = [];
