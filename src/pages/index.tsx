import React, {
  useEffect,
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
import {
  ftAbi,
  nftAbi,
} from '@/constants/abi';
import { apiPromise } from '@/utils/polkadot-api';
import { utils } from 'ethers';
import Account from './components/account';
import ClaimForm from './components/claim-form';
import s from './index.module.less';

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

interface NFTLinkRecordType {
  id: number
  openSeaLink: string
  nftScanLink: string
}

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

const nftLinkColumns: TableColumnsType<NFTLinkRecordType> = [{
  title: 'MNFT ID',
  dataIndex: 'id',
  width: 100,
}, {
  title: 'OpenSea Link',
  dataIndex: 'openSeaLink',
  render: (openSeaLink) => <a href={openSeaLink} target="_blank" rel="noreferrer">{openSeaLink}</a>,
  className: s.BreakWord,
}, {
  title: 'NFT Scan Link',
  dataIndex: 'nftScanLink',
  render: (nftScanLink) => <a href={nftScanLink} target="_blank" rel="noreferrer">{nftScanLink}</a>,
  className: s.BreakWord,
}];

export default function Layout() {
  const { publicKey } = useAppSelector((state) => ({
    publicKey: selectEntities(state).publicKey,
  }));
  const { address } = useAccount();
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
  const [nftIds, setNftIds] = useState<number[]>([]);
  useEffect(() => {
    const fetchPolkadotTransactionCount = async () => {
      const api = await apiPromise;
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

        api.query.uniques.tokens(NftTokenId, publicKey).then((ids) => {
          setNftIds(ids.toJSON() as number[]);
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

  const nftLinkDataSource = map<number, NFTLinkRecordType>((id) => ({
    id,
    openSeaLink: `https://testnets.opensea.io/assets/goerli/${NftTokenAddressMap[goerli.id]}/${id}`,
    nftScanLink: `https://platon.nftscan.com/${NftTokenAddressMap[platON.id]}/${id}`,
  }))(nftIds);

  return (
    <div className={s.Index}>
      <Account publicKey={publicKey} address={address} />

      {publicKey && (
        <>
          <h2 className={s.Title}>领取测试币</h2>
          <ClaimForm publicKey={publicKey} />
        </>
      )}

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

      <h2 className={s.Title}>Omniverse Non-Fungible Token List</h2>
      <Table<NFTLinkRecordType>
        dataSource={nftLinkDataSource}
        columns={nftLinkColumns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
