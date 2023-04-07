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
}, {
  inputs: [
    {
      components: [
        {
          internalType: 'uint128',
          name: 'nonce',
          type: 'uint128',
        },
        {
          internalType: 'uint32',
          name: 'chainId',
          type: 'uint32',
        },
        {
          internalType: 'bytes',
          name: 'initiateSC',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'from',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'payload',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
      ],
      internalType: 'struct ERC6358TransactionData',
      name: '_data',
      type: 'tuple',
    },
  ],
  name: 'sendOmniverseTransaction',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}] as const;

export const nftAbi = [{
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
}, {
  inputs: [
    {
      components: [
        {
          internalType: 'uint128',
          name: 'nonce',
          type: 'uint128',
        },
        {
          internalType: 'uint32',
          name: 'chainId',
          type: 'uint32',
        },
        {
          internalType: 'bytes',
          name: 'initiateSC',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'from',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'payload',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
      ],
      internalType: 'struct ERC6358TransactionData',
      name: '_data',
      type: 'tuple',
    },
  ],
  name: 'sendOmniverseTransaction',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}] as const;
