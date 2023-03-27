import {
  bscTestnet,
  moonbaseAlpha,
  goerli,
} from 'wagmi/chains';

export type { Chain } from 'wagmi/chains';

export const chains = [bscTestnet, moonbaseAlpha, goerli];

export const tokenAddressMap: Record<string, `0x${string}`> = {
  [bscTestnet.id]: '0xBF2F3eae1e507e6A6450C7E8BCa40b273962AA6B',
  [moonbaseAlpha.id]: '0xe07804c5e32423A95a0B1fA56845D7fC46230847',
  [goerli.id]: '0xcbC3b5A344eE3d55a7527F1a5e6dB4CE84DdB380',
};
