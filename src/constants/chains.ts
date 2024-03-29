import {
  // bscTestnet,
  sepolia,
  Chain,
} from 'wagmi/chains';

export {
  bscTestnet,
  sepolia,
} from 'wagmi/chains';
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

export const mumbai: Chain = {
  id: 80001,
  name: 'Mumbai',
  network: 'Mumbai',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-mumbai.maticvigil.com'],
    },
    public: {
      http: ['https://rpc-mumbai.maticvigil.com'],
    },
  },
};

// export const chains = [bscTestnet, platON, sepolia, mumbai];
export const chains = [platON, sepolia, mumbai];

export interface ChainInfo {
  ftAddress: `0x${string}`
  nftAddress: `0x${string}`
  omniverseChainId: number
}

export const chainInfoMap: Record<string, ChainInfo> = {
  // [bscTestnet.id]: {
  //   ftAddress: '0x12B22989407C8E6C69df5477AbD7b569b024Aba0',
  //   nftAddress: '0x1AF65Fa4fd838074980CadB398969C9fA10c9Ce7',
  //   omniverseChainId: 0,
  // },
  [platON.id]: {
    ftAddress: '0x4C121e60BF0ff5094e718354eE00202B901FEF1e',
    nftAddress: '0x6517495b90acb1062076270EDE4ed772fdE277b9',
    omniverseChainId: 4,
  },
  [sepolia.id]: {
    ftAddress: '0xa1278174CF8f35B72f87C351ADC9E991470c6160',
    nftAddress: '0xdCC3ec86A5d6C151054D89B8759F4772e703909a',
    omniverseChainId: 5,
  },
  [mumbai.id]: {
    ftAddress: '0xa1278174CF8f35B72f87C351ADC9E991470c6160',
    nftAddress: '0xc0caE974357948d046A46Ac6c286E4BDE016fC6B',
    omniverseChainId: 6,
  },
};
