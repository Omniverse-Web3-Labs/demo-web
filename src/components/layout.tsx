import React, { ReactNode } from 'react';
import {
  Outlet,
} from 'react-router-dom';
import {
  ConfigProvider,
} from 'antd';
import {
  useAccount,
  useBalance,
  useConnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import {
  tokenAddressMap,
  chains,
  Chain,
} from '@/constants/chains';
import { map } from 'lodash/fp';
import { InjectedConnector } from 'wagmi/connectors/injected';
import 'antd/dist/reset.css';

const injectedConnector = new InjectedConnector();

export default function Layout() {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: injectedConnector,
  });
  const { data, refetch } = useBalance({
    address,
    enabled: !!chain,
    token: chain ? tokenAddressMap[chain.id] : undefined,
  });

  return (
    <ConfigProvider>
      <div>
        <div>
          <p>Current Chain: {chain?.name}</p>
          <p>Address: {address}</p>
          <p>Balance: {data?.formatted}</p>
          <p>{!isConnected && <button onClick={() => connect()}>Connect</button>}</p>
          <p>
            <select
              onChange={async ({ target: { value } }) => {
                if (chain && switchNetworkAsync && value !== chain.id.toString()) {
                  await switchNetworkAsync(chain.id);
                  await refetch();
                }
              }}
            >
              {map<Chain, ReactNode>(({ id, name }) => (
                <option value={id} key={id}>{name}</option>
              ))(chains)}
            </select>
          </p>
        </div>

        <div>
          <Outlet />
        </div>

        <div>
          Footer
        </div>
      </div>
    </ConfigProvider>
  );
}
