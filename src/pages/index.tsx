import React, {
  useEffect,
  useState,
} from 'react';
import {
  Table,
  TableColumnsType,
} from 'antd';
import {
  chains,
  chainInfoMap,
} from '@/constants/chains';
import {
  NftTokenId,
  FtTokenId,
} from '@/constants/token-id';
import { useAppSelector } from '@/redux';
import { selectEntities } from '@/redux/account';
import {
  useAccount,
  useBalance,
  useContractReads,
} from 'wagmi';
import {
  ftAbi,
  // nftAbi,
} from '@/constants/abi';
import { apiPromise } from '@/utils/polkadot-api';
import { utils } from 'ethers';
import axios from 'axios';
import Account from './components/account';
import ClaimForm from './components/claim-form';
import TransferForm from './components/transfer-form';
import s from './index.module.less';

interface FTRecordType {
  chainName: string
  tokenId: string
  oNonce?: string
  oBalance?: string
}

const ftColumns: TableColumnsType<FTRecordType> = [{
  title: 'Chain',
  dataIndex: 'chainName',
}, {
  title: 'Asset ID',
  dataIndex: 'tokenId',
}, {
  title: 'FT O-Nonce',
  dataIndex: 'oNonce',
}, {
  title: 'O-Balance',
  dataIndex: 'oBalance',
}];

// const nftColumns: TableColumnsType<NFTRecordType> = [{
//   title: 'Chain',
//   dataIndex: 'chainName',
// }, {
//   title: 'Asset ID',
//   dataIndex: 'tokenId',
// }, {
//   title: 'NO-Nonce',
//   dataIndex: 'noNonce',
// }];

// const nftLinkColumns: TableColumnsType<NFTLinkRecordType> = [{
//   title: 'MNFT ID',
//   dataIndex: 'id',
//   width: 100,
// }, {
//   title: 'OpenSea Link',
//   dataIndex: 'openSeaLink',
//   render: (openSeaLink) => <a href={openSeaLink} target="_blank" rel="noreferrer">{openSeaLink}</a>,
//   className: s.BreakWord,
// }, {
//   title: 'NFT Scan Link',
//   dataIndex: 'nftScanLink',
//   render: (nftScanLink) => <a href={nftScanLink} target="_blank" rel="noreferrer">{nftScanLink}</a>,
//   className: s.BreakWord,
// }];

export default function Layout() {
  const { publicKey } = useAppSelector((state) => ({
    publicKey: selectEntities(state).publicKey,
  }));
  const { address } = useAccount();
  const ftTransactionCountReads = useContractReads({
    enabled: !!publicKey,
    contracts: chains.map(({ id }) => ({
      address: chainInfoMap[id].ftAddress,
      functionName: 'getTransactionCount',
      chainId: id,
      abi: ftAbi,
      args: [publicKey!],
    })),
  });
  // const nftTransactionCountReads = useContractReads({
  //   enabled: !!publicKey,
  //   contracts: chains.map(({ id }) => ({
  //     address: chainInfoMap[id].nftAddress,
  //     functionName: 'getTransactionCount',
  //     chainId: id,
  //     abi: nftAbi,
  //     args: [publicKey!],
  //   })),
  // });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ftBalances = chains.map(({ id }) => useBalance({
    address,
    enabled: !!address,
    chainId: id,
    token: chainInfoMap[id].ftAddress,
  }));
  const ftONonceMap: Record<string, string> = {};
  if (ftTransactionCountReads.isSuccess) {
    chains.forEach(({ id }, index) => {
      ftONonceMap[id] = ftTransactionCountReads.data![index]?.toString() || '';
    });
  }
  // const nftONonceMap: Record<string, string> = {};
  // if (nftTransactionCountReads.isSuccess) {
  //   chains.forEach(({ id }, index) => {
  //     nftONonceMap[id] = nftTransactionCountReads.data![index]?.toString() || '';
  //   });
  // }
  const oBalanceMap: Record<string, string> = {};
  chains.forEach(({ id }, index) => {
    if (ftBalances[index].isSuccess) {
      oBalanceMap[id] = ftBalances[index]!.data!.formatted;
    }
  });
  const [ftTransactionCount, setFtTransactionCount] = useState<string | undefined>();
  const [, setNftTransactionCount] = useState<string | undefined>();
  const [polkadotBalance, setPolkadotBalance] = useState<string | undefined>();
  const [, setNftIds] = useState<number[]>([]);
  const [btcDataSource, setBtcDataSource] = useState<FTRecordType>({
    chainName: 'btc',
    tokenId: '1',
    oNonce: '0',
    oBalance: '0',
  });

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
          'uniques',
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
  }, [publicKey, btcDataSource]);

  const fetchBtcTransactionData = async () => {
    const resp = await axios.get('http://198.11.168.201:3000/api/getTransactionCount', {
      params: {
        pk: publicKey,
      },
    });
    if (!resp.data.error) {
      const { result } = resp.data;
      btcDataSource.oNonce = result;
    }
    const resp2 = await axios.get('http://198.11.168.201:3000/api/omniverseBalanceOf', {
      params: {
        pk: publicKey,
      },
    });
    if (!resp2.data.error) {
      const { result } = resp2.data;
      btcDataSource.oBalance = result;
    }
    setBtcDataSource(btcDataSource);
  };
  fetchBtcTransactionData();

  const ftDataSource: FTRecordType[] = [...chains.map(({ name }, index) => ({
    chainName: name,
    tokenId: FtTokenId,
    oNonce: ftTransactionCountReads.data?.[index]?.toString(),
    oBalance: ftBalances[index].data?.formatted,
  })), {
    chainName: 'Substrate',
    tokenId: FtTokenId,
    oNonce: ftTransactionCount,
    oBalance: polkadotBalance,
  }, {
    chainName: 'BTC Ordinals 6358',
    tokenId: FtTokenId,
    oNonce: btcDataSource.oNonce,
    oBalance: (btcDataSource.oBalance ? BigInt(btcDataSource.oBalance!) / BigInt(10 ** 12) : 0).toString(),
  }];

  // const nftDataSource: NFTRecordType[] = [...chains.map(({ name }, index) => ({
  //   chainName: name,
  //   tokenId: NftTokenId,
  //   noNonce: nftTransactionCountReads.data?.[index]?.toString(),
  // })), {
  //   chainName: 'Substrate',
  //   tokenId: NftTokenId,
  //   noNonce: nftTransactionCount,
  // }, {
  //   chainName: 'BTC-Ordinal5-6358',
  //   tokenId: NftTokenId,
  //   noNonce: nftTransactionCount,
  // }];

  // const nftLinkDataSource = map<number, NFTLinkRecordType>((id) => ({
  //   id,
  //   openSeaLink: `https://testnets.opensea.io/assets/mumbai/${chainInfoMap[mumbai.id].nftAddress}/${id}`,
  //   nftScanLink: `https://platon.nftscan.com/${chainInfoMap[platON.id].nftAddress}/${id}`,
  // }))(nftIds);

  return (
    <div className={s.Index}>
      <Account publicKey={publicKey} address={address} />

      {publicKey && (
        <>
          <h2 className={s.Title}>Apply for Testing Assets</h2>
          <ClaimForm publicKey={publicKey} />
        </>
      )}

      {publicKey && address && (
        <>
          <h2 className={s.Title}>Present as a Gift</h2>
          <TransferForm publicKey={publicKey} address={address} />
        </>
      )}

      <h2 className={s.Title}>Omniverse Fungible Asset</h2>
      <Table<FTRecordType>
        dataSource={ftDataSource}
        columns={ftColumns}
        rowKey="chainName"
        pagination={false}
      />

      {/* <h2 className={s.Title}>Omniverse Non-Fungible Asset</h2>
      <Table<NFTRecordType>
        dataSource={nftDataSource}
        columns={nftColumns}
        rowKey="chainName"
        pagination={false}
      />

      <h2 className={s.Title}>Omniverse Non-Fungible Asset List</h2>
      <Table<NFTLinkRecordType>
        dataSource={nftLinkDataSource}
        columns={nftLinkColumns}
        rowKey="id"
        pagination={false}
      /> */}
    </div>
  );
}
