import {
  bscTestnet,
  moonbaseAlpha,
  goerli,
  Chain,
} from 'wagmi/chains';

export { bscTestnet, moonbaseAlpha } from 'wagmi/chains';
export type { Chain } from 'wagmi/chains';

export const platON: Chain = {
  id: 210425,
  name: 'PlatON',
  network: 'platON',
  nativeCurrency: {
    decimals: 18,
    name: 'LAT',
    symbol: 'LAT',
  },
  rpcUrls: {
    default: {
      http: ['https://openapi2.platon.network/rpc'],
      webSocket: ['wss://openapi2.platon.network/ws'],
    },
    public: {
      http: ['https://openapi2.platon.network/rpc'],
      webSocket: ['wss://openapi2.platon.network/ws'],
    },
  },
};

export const chains = [bscTestnet, moonbaseAlpha, platON];

export const FtTokenAddressMap: Record<string, `0x${string}`> = {
  [bscTestnet.id]: '0x7c52b6e88c9Cc397d82506b9e4df6D7D06674934',
  [moonbaseAlpha.id]: '0x4B89eBA967d8333C6664F42A18EE5fb42e22a0dA',
  [platON.id]: '0x1181E9bBb48a5448c81CF1A2532A3D4257C69E22',
};

export const NftTokenAddressMap: Record<string, `0x${string}`> = {
  [bscTestnet.id]: '0xBF2F3eae1e507e6A6450C7E8BCa40b273962AA6B',
  [moonbaseAlpha.id]: '0xe07804c5e32423A95a0B1fA56845D7fC46230847',
  [platON.id]: '0x68170f4Dc61c02771051CcD0FF26295D6330f47d',
  [goerli.id]: '0xcbC3b5A344eE3d55a7527F1a5e6dB4CE84DdB380',
};

export const FtTokenId = 'MFT';
export const NftTokenId = 'MNFT';
