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
  tokenAddressMap,
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
import { ftAbi } from '@/constants/abi';
import { ApiPromise, HttpProvider } from '@polkadot/api';
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

const httpProvider = new HttpProvider('http://35.158.224.2:9911');
const api = await ApiPromise.create({ provider: httpProvider, noInitWarn: true });

const tokenId = 'MFT';

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
      address: '0x1181E9bBb48a5448c81CF1A2532A3D4257C69E22',
      functionName: 'getTransactionCount',
      chainId: platON.id,
      abi: ftAbi,
      args: [publicKey!],
    }, {
      address: '0x4B89eBA967d8333C6664F42A18EE5fb42e22a0dA',
      functionName: 'getTransactionCount',
      chainId: moonbaseAlpha.id,
      abi: ftAbi,
      args: [publicKey!],
    }, {
      address: '0x7c52b6e88c9Cc397d82506b9e4df6D7D06674934',
      functionName: 'getTransactionCount',
      chainId: bscTestnet.id,
      abi: ftAbi,
      args: [publicKey!],
    }],
  });
  const bscTestnetBalance = useBalance({
    address,
    enabled: !!address,
    chainId: bscTestnet.id,
    token: tokenAddressMap[bscTestnet.id],
  });
  const moonbaseAlphaBalance = useBalance({
    address,
    enabled: !!address,
    chainId: moonbaseAlpha.id,
    token: tokenAddressMap[moonbaseAlpha.id],
  });
  const platONBalance = useBalance({
    address,
    enabled: !!address,
    chainId: platON.id,
    token: tokenAddressMap[platON.id],
  });
  const oNonceMap: Record<string, string> = {};
  if (isSuccess && data) {
    oNonceMap[platON.id] = data[0].toString();
    oNonceMap[moonbaseAlpha.id] = data[1].toString();
    oNonceMap[bscTestnet.id] = data[2].toString();
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
  const [polkadotTransactionCount, setPolkadotTransactionCount] = useState<string | undefined>();
  const [polkadotBalance, setPolkadotBalance] = useState<string | undefined>();
  useEffect(() => {
    const fetchPolkadotTransactionCount = async () => {
      if (publicKey) {
        const count = await api.query.omniverseProtocol.transactionCount(
          publicKey,
          'assets',
          tokenId,
        );
        setPolkadotTransactionCount((count.toJSON() as number).toString());

        const balance = await api.query.assets.tokens(
          tokenId,
          publicKey,
        );
        setPolkadotBalance((balance.toJSON() as number).toString());
      }
    };
    fetchPolkadotTransactionCount();
  }, [publicKey]);

  const ftDataSource = flow(
    map<Chain, FTRecordType>(({ id, name }) => ({
      chainName: name,
      tokenId,
      oNonce: oNonceMap[id],
      oBalance: oBalanceMap[id],
    })),
    concat<FTRecordType>({
      chainName: 'Substrate',
      tokenId,
      oNonce: polkadotTransactionCount,
      oBalance: polkadotBalance,
    }),
  )([platON, moonbaseAlpha, bscTestnet]);

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
    </div>
  );
}
