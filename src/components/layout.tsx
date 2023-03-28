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
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import {
  tokenAddressMap,
  chains,
  Chain,
  bscTestnet,
  moonbaseAlpha,
  platON,
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
  const { disconnect } = useDisconnect();
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

  return (
    <ConfigProvider>
      <div>
        <div>
          <p>Current Chain: {chain?.name}</p>
          <p>Address: {address}</p>
          <p>Token Address: {chain && tokenAddressMap[chain.id]}</p>
          <p>bscTestnet Balance: {bscTestnetBalance.data?.formatted}</p>
          <p>moonbaseAlpha Balance: {moonbaseAlphaBalance.data?.formatted}</p>
          <p>platON Balance: {platONBalance.data?.formatted}</p>
          <p>
            <button
              onClick={() => {
                if (isConnected) {
                  disconnect();
                } else {
                  connect();
                }
              }}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </p>
          <p>
            <select
              value={chain?.id.toString()}
              onChange={async ({ target: { value } }) => {
                if (chain && switchNetworkAsync && value !== chain.id.toString()) {
                  await switchNetworkAsync(chain.id);
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
