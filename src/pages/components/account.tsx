import React, {
  useMemo,
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
} from '@/constants/chains';
import {
  map,
  flow,
  concat,
} from 'lodash/fp';
import { getPolkadotAddressFromPubKey } from '@/utils/public-key';
import s from '../index.module.less';

interface AccountRecordType {
  chainName: string
  oAddress?: string
  address?: string
}

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

export interface AccountProps {
  publicKey?: `0x${string}`
  address?: `0x${string}`
}

export default function Account({ publicKey, address }: AccountProps) {
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

  return (
    <div>
      <h2 className={s.Title}>账号信息</h2>
      <Table<AccountRecordType>
        dataSource={accountDataSource}
        columns={accountColumns}
        rowKey="chainName"
        pagination={false}
      />
    </div>
  );
}
