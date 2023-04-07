import {
  bscTestnet,
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

export const chains = [bscTestnet, platON, sepolia, mumbai];

export interface ChainInfo {
  ftAddress: `0x${string}`
  nftAddress: `0x${string}`
  omniverseChainId: number
}

export const chainInfoMap: Record<string, ChainInfo> = {
  [bscTestnet.id]: {
    ftAddress: '0x12B22989407C8E6C69df5477AbD7b569b024Aba0',
    nftAddress: '0x1AF65Fa4fd838074980CadB398969C9fA10c9Ce7',
    omniverseChainId: 0,
  },
  [platON.id]: {
    ftAddress: '0x0791B79Ba0DC124dd357633Bf298719aa12f7D59',
    nftAddress: '0x13A689B55FF8Bf86a8dEAC357553eabDd93f78fb',
    omniverseChainId: 4,
  },
  [sepolia.id]: {
    ftAddress: '0x64aEcC149f292eCbCf8Dd93B320d5a9780aba191',
    nftAddress: '0x081Ba0C5C458F1D350F95dc4e6Dc172e69F8Fff7',
    omniverseChainId: 5,
  },
  [mumbai.id]: {
    ftAddress: '0x1181e9bbb48a5448c81cf1a2532a3d4257c69e22',
    nftAddress: '0x4F77711365BB96969D763Fc8CB6cB40964aC94Ce',
    omniverseChainId: 6,
  },
};

export const FtTokenId = 'SKYWALKER';
export const NftTokenId = 'SKYWALKERNFT';
