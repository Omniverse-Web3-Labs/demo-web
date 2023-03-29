import React, {
  useCallback,
} from 'react';
import {
  Outlet,
} from 'react-router-dom';
import {
  ConfigProvider,
  Layout as AntdLayout,
  Button,
} from 'antd';
import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletOutlined } from '@ant-design/icons';
import { ellipsis } from '@/utils/formatter';
import 'antd/dist/reset.css';
import './global.less';
import s from './layout.module.less';

const injectedConnector = new InjectedConnector();

const { Header, Content, Footer } = AntdLayout;

export default function Layout() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: injectedConnector,
  });
  const { disconnect } = useDisconnect();
  const toggleConnection = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [isConnected, disconnect, connect]);

  return (
    <ConfigProvider>
      <Header>
        <div className={s.Header}>
          <h1>
            Omniverse Lab
          </h1>
          <div className={s.Operations}>
            {address && <div className={s.Address}><WalletOutlined /> {ellipsis({ endLength: 12 })(address)}</div>}
            <Button
              onClick={toggleConnection}
              type="primary"
              size="large"
            >
              { isConnected ? 'Disconnect' : 'Connect' }
            </Button>
          </div>
        </div>
      </Header>
      <Content className={s.ContentContainer}>
        <div className={s.Content}>
          <Outlet />
        </div>
      </Content>
      <Footer>
        <div className={s.Footer}>
          Omniverse Lab ©2023
        </div>
      </Footer>
    </ConfigProvider>
  );
}
