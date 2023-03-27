import React from 'react';
import ReactDOM from 'react-dom/client';
import store from '@/redux';
import { Provider } from 'react-redux';
import {
  WagmiConfig,
  configureChains,
  createClient,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { chains } from './constants/chains';

import App from './app';

console.log(`App Version: ${APP_VERSION}`);
console.log(`App Mode: ${import.meta.env.MODE}`);

const { provider, webSocketProvider } = configureChains(
  chains,
  [publicProvider()],
);
const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <App />
      </WagmiConfig>
    </Provider>
  </React.StrictMode>,
);
