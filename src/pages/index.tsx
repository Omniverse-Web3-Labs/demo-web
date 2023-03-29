import React, { useMemo } from 'react';
import { Table, TableColumnsType } from 'antd';
import { chains, Chain } from '@/constants/chains';
import { map, flow, concat } from 'lodash/fp';
import { useAppSelector } from '@/redux';
import { selectEntities } from '@/redux/account';
import { useAccount } from 'wagmi';
import { getPolkadotAddressFromPubKey } from '@/utils/public-key';

interface RecordType {
  chainName: string
  oAddress?: string
  address?: string
}

const columns: TableColumnsType<RecordType> = [{
  title: 'Chain',
  dataIndex: 'chainName',
}, {
  title: 'O-Address',
  dataIndex: 'oAddress',
  ellipsis: { showTitle: true },
}, {
  title: 'Address',
  dataIndex: 'address',
}];

export default function Layout() {
  const { publicKey } = useAppSelector((state) => ({
    publicKey: selectEntities(state).publicKey,
  }));
  const { address } = useAccount();
  const dataSource = useMemo(() => flow(
    map<Chain, RecordType>(({ name }) => ({
      chainName: name,
      oAddress: publicKey,
      address,
    })),
    concat<RecordType>({
      chainName: 'Substrate',
      oAddress: publicKey,
      address: publicKey ? getPolkadotAddressFromPubKey(publicKey) : '',
    }),
  )(chains), [address, publicKey]);

  return (
    <div>
      <h2>账号信息</h2>
      <Table<RecordType>
        dataSource={dataSource}
        columns={columns}
        rowKey="chainName"
        pagination={false}
      />
    </div>
  );
}
