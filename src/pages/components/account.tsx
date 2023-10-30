import React, {
  useMemo,
} from 'react';
import {
  Table,
  TableColumnsType,
} from 'antd';
import {
  Chain,
} from 'wagmi/chains';
import {
  chains,
} from '@/constants/chains';
import {
  map,
  flow,
  concat,
} from 'lodash/fp';
import { getPolkadotAddressFromPubKey, getBitcoinAddressFromPubKey } from '@/utils/crypto';
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
    concat<AccountRecordType>({
      chainName: 'Bitcoin',
      oAddress: publicKey,
      address: publicKey ? getBitcoinAddressFromPubKey(publicKey) : '', 
    }),
  )(chains), [address, publicKey]);

  return (
    <div>
      <h2 className={s.Title}>Account on Omni-Chain</h2>
      <Table<AccountRecordType>
        dataSource={accountDataSource}
        columns={accountColumns}
        rowKey="chainName"
        pagination={false}
      />
    </div>
  );
}
