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
import {
  ApiOutlined,
  DisconnectOutlined,
  WalletOutlined,
} from '@ant-design/icons';
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
      window.location.reload();
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
            <a
              className={s.Link}
              href="https://github.com/Omniverse-Web3-Labs/Omniverse-DLT-Introduction/blob/main/docs/Deployment.md"
              target="_blank"
              rel="noreferrer"
            >
              Deploy Own Omnivers
            </a>
            {address && <div className={s.Address}><WalletOutlined /> {ellipsis({ endLength: 12 })(address)}</div>}
            <Button
              onClick={toggleConnection}
              type="primary"
              size="large"
              icon={isConnected ? <DisconnectOutlined /> : <ApiOutlined />}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
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
