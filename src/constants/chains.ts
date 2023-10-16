import {
  // bscTestnet,
  Chain,
} from 'wagmi/chains';

export {
  bscTestnet,
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

export const sepolia: Chain = {
  id: 11155111,
  name: 'Sepolia',
  network: 'Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://eth.getblock.io/f19d7993-2e1e-44eb-a48e-bc55356c5e78/sepolia/'],
    },
    public: {
      http: ['https://eth.getblock.io/f19d7993-2e1e-44eb-a48e-bc55356c5e78/sepolia/'],
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
/*
export const btc: Chain = {
  id: 1,
  name: 'Btc',
  network: 'Btc',
  nativeCurrency: {
    decimals: 18,
    name: 'btc',
    symbol: 'btc',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:3000/rpc'],
    },
    public: {
      http: ['http://localhost:3000/rpc'],
    },
  },
};
*/
// export const chains = [platON, sepolia, mumbai];
export const chains = [sepolia];

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
    ftAddress: '0x02A964151eB83661302629AfE6c879195b42b335',
    nftAddress: '0xdCC3ec86A5d6C151054D89B8759F4772e703909a',
    omniverseChainId: 5,
  },
  [mumbai.id]: {
    ftAddress: '0xa1278174CF8f35B72f87C351ADC9E991470c6160',
    nftAddress: '0xc0caE974357948d046A46Ac6c286E4BDE016fC6B',
    omniverseChainId: 6,
  },
  /*
  [btc.id]: {
    ftAddress: '0x4a41672e9a217c3193b12483400b03ce1851e145',
    nftAddress: '0x4a41672e9a217c3193b12483400b03ce1851e145',
    omniverseChainId: 2,
  }, */
};
