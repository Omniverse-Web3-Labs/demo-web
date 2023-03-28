/* eslint-disable import/no-extraneous-dependencies */
import {
  defineConfig,
} from 'vite';
import react from '@vitejs/plugin-react';
import {
  resolve,
} from 'path';
import { execSync } from 'child_process';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const projectRootDir = resolve(__dirname);
// https://vitejs.dev/config/
export default defineConfig(() => {
  const appVersion = JSON.stringify(execSync('git rev-parse HEAD').toString().trim());

  return {
    define: {
      APP_VERSION: appVersion,
    },
    plugins: [
      react(),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(projectRootDir, 'src'),
      },
    },
    build: {
      emptyOutDir: true,
    },
  };
});
