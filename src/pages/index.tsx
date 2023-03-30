import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Table,
  TableColumnsType,
} from 'antd';
import {
  Chain,
  goerli,
  moonbaseAlpha,
  bscTestnet,
} from 'wagmi/chains';
import {
  platON,
  FtTokenAddressMap,
  FtTokenId,
  NftTokenId,
  NftTokenAddressMap,
} from '@/constants/chains';
import {
  map,
  flow,
  concat,
} from 'lodash/fp';
import { useAppSelector } from '@/redux';
import { selectEntities } from '@/redux/account';
import {
  useAccount,
  useBalance,
  useContractReads,
} from 'wagmi';
import { getPolkadotAddressFromPubKey } from '@/utils/public-key';
import { ftAbi, nftAbi } from '@/constants/abi';
import { ApiPromise, HttpProvider } from '@polkadot/api';
import { utils } from 'ethers';
import s from './index.module.less';

interface AccountRecordType {
  chainName: string
  oAddress?: string
  address?: string
}

interface FTRecordType {
  chainName: string
  tokenId: string
  oNonce?: string
  oBalance?: string
}

interface NFTRecordType {
  chainName: string
  tokenId: string
  noNonce?: string
}

const httpProvider = new HttpProvider('http://35.158.224.2:9911');

const accountColumns: TableColumnsType<AccountRecordType> = [{
  title: 'Chain',
  dataIndex: 'chainName',
}, {
  title: 'O-Address',
  dataIndex: 'oAddress',
  className: s.BreakWord,
}, {
  title: 'Address',
  dataIndex: 'address',
  className: s.BreakWord,
}];

const ftColumns: TableColumnsType<FTRecordType> = [{
  title: 'Chain',
  dataIndex: 'chainName',
}, {
  title: 'Token ID',
  dataIndex: 'tokenId',
}, {
  title: 'FT O-Nonce',
  dataIndex: 'oNonce',
}, {
  title: 'O-Balance',
  dataIndex: 'oBalance',
}];

const nftColumns: TableColumnsType<NFTRecordType> = [{
  title: 'Chain',
  dataIndex: 'chainName',
}, {
  title: 'Token ID',
  dataIndex: 'tokenId',
}, {
  title: 'NO-Nonce',
  dataIndex: 'noNonce',
}];

export default function Layout() {
  const { publicKey } = useAppSelector((state) => ({
    publicKey: selectEntities(state).publicKey,
  }));
  const { address } = useAccount();
  const accountDataSource = useMemo(() => flow(
    map<Chain, AccountRecordType>(({ name }) => ({
      chainName: name,
      oAddress: publicKey,
      address,
    })),
    concat<AccountRecordType>({
      chainName: 'Substrate',
      oAddress: publicKey,
      address: publicKey ? getPolkadotAddressFromPubKey(publicKey) : '',
    }),
  )([bscTestnet, goerli, moonbaseAlpha, platON]), [address, publicKey]);
  const { data, isSuccess } = useContractReads({
    enabled: !!publicKey,
    contracts: [{
      address: FtTokenAddressMap[platON.id],
      functionName: 'getTransactionCount',
      chainId: platON.id,
      abi: ftAbi,
      args: [publicKey!],
    }, {
      address: FtTokenAddressMap[moonbaseAlpha.id],
      functionName: 'getTransactionCount',
      chainId: moonbaseAlpha.id,
      abi: ftAbi,
      args: [publicKey!],
    }, {
      address: FtTokenAddressMap[bscTestnet.id],
      functionName: 'getTransactionCount',
      chainId: bscTestnet.id,
      abi: ftAbi,
      args: [publicKey!],
    }, {
      address: NftTokenAddressMap[platON.id],
      functionName: 'getTransactionCount',
      chainId: platON.id,
      abi: nftAbi,
      args: [publicKey!],
    }, {
      address: NftTokenAddressMap[moonbaseAlpha.id],
      functionName: 'getTransactionCount',
      chainId: moonbaseAlpha.id,
      abi: nftAbi,
      args: [publicKey!],
    }, {
      address: NftTokenAddressMap[bscTestnet.id],
      functionName: 'getTransactionCount',
      chainId: bscTestnet.id,
      abi: nftAbi,
      args: [publicKey!],
    }, {
      address: NftTokenAddressMap[goerli.id],
      functionName: 'getTransactionCount',
      chainId: goerli.id,
      abi: nftAbi,
      args: [publicKey!],
    }],
  });
  const bscTestnetBalance = useBalance({
    address,
    enabled: !!address,
    chainId: bscTestnet.id,
    token: FtTokenAddressMap[bscTestnet.id],
  });
  const moonbaseAlphaBalance = useBalance({
    address,
    enabled: !!address,
    chainId: moonbaseAlpha.id,
    token: FtTokenAddressMap[moonbaseAlpha.id],
  });
  const platONBalance = useBalance({
    address,
    enabled: !!address,
    chainId: platON.id,
    token: FtTokenAddressMap[platON.id],
  });
  const ftONonceMap: Record<string, string> = {};
  const nftONonceMap: Record<string, string> = {};
  if (isSuccess && data) {
    ftONonceMap[platON.id] = data[0]?.toString();
    ftONonceMap[moonbaseAlpha.id] = data[1]?.toString();
    ftONonceMap[bscTestnet.id] = data[2]?.toString();
    nftONonceMap[platON.id] = data[3]?.toString();
    nftONonceMap[moonbaseAlpha.id] = data[4]?.toString();
    nftONonceMap[bscTestnet.id] = data[5]?.toString();
    nftONonceMap[goerli.id] = data[6]?.toString();
  }
  const oBalanceMap: Record<string, string> = {};
  if (bscTestnetBalance.isSuccess && bscTestnetBalance.data) {
    oBalanceMap[bscTestnet.id] = bscTestnetBalance.data.formatted;
  }
  if (moonbaseAlphaBalance.isSuccess && moonbaseAlphaBalance.data) {
    oBalanceMap[moonbaseAlpha.id] = moonbaseAlphaBalance.data.formatted;
  }
  if (platONBalance.isSuccess && platONBalance.data) {
    oBalanceMap[platON.id] = platONBalance.data.formatted;
  }
  const [ftTransactionCount, setFtTransactionCount] = useState<string | undefined>();
  const [nftTransactionCount, setNftTransactionCount] = useState<string | undefined>();
  const [polkadotBalance, setPolkadotBalance] = useState<string | undefined>();
  useEffect(() => {
    const fetchPolkadotTransactionCount = async () => {
      const api = await ApiPromise.create({ provider: httpProvider, noInitWarn: true });
      if (publicKey) {
        api.query.omniverseProtocol.transactionCount(
          publicKey,
          'assets',
          FtTokenId,
        ).then((count) => {
          setFtTransactionCount(count.toString());
        });

        api.query.omniverseProtocol.transactionCount(
          publicKey,
          'assets',
          NftTokenId,
        ).then((count) => {
          setNftTransactionCount(count.toString());
        });

        Promise.all([
          api.query.assets.tokens(FtTokenId, publicKey),
          api.query.assets.tokenId2AssetId(FtTokenId).then((assetId) => api.query.assets.metadata(assetId.toJSON())),
        ]).then(([balance, metadata]) => {
          setPolkadotBalance(utils.formatUnits(balance.toString(), (metadata as any).decimals.toJSON()));
        });
      }
    };
    fetchPolkadotTransactionCount();
  }, [publicKey]);

  const ftDataSource = flow(
    map<Chain, FTRecordType>(({ id, name }) => ({
      chainName: name,
      tokenId: FtTokenId,
      oNonce: ftONonceMap[id],
      oBalance: oBalanceMap[id],
    })),
    concat<FTRecordType>({
      chainName: 'Substrate',
      tokenId: FtTokenId,
      oNonce: ftTransactionCount,
      oBalance: polkadotBalance,
    }),
  )([platON, moonbaseAlpha, bscTestnet]);

  const nftDataSource = flow(
    map<Chain, NFTRecordType>(({ id, name }) => ({
      chainName: name,
      tokenId: NftTokenId,
      noNonce: nftONonceMap[id],
    })),
    concat<NFTRecordType>({
      chainName: 'Substrate',
      tokenId: NftTokenId,
      noNonce: nftTransactionCount,
    }),
  )([platON, moonbaseAlpha, bscTestnet, goerli]);

  return (
    <div>
      <h2 className={s.Title}>账号信息</h2>
      <Table<AccountRecordType>
        dataSource={accountDataSource}
        columns={accountColumns}
        rowKey="chainName"
        pagination={false}
      />

      <h2 className={s.Title}>Omniverse Fungible Token</h2>
      <Table<FTRecordType>
        dataSource={ftDataSource}
        columns={ftColumns}
        rowKey="chainName"
        pagination={false}
      />

      <h2 className={s.Title}>Omniverse Non-Fungible Token</h2>
      <Table<NFTRecordType>
        dataSource={nftDataSource}
        columns={nftColumns}
        rowKey="chainName"
        pagination={false}
      />
    </div>
  );
}
