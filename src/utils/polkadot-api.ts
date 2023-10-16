import {
  ApiPromise,
  HttpProvider,
} from '@polkadot/api';

export const httpProvider = new HttpProvider('http://47.254.40.186:9933');

export const apiPromise = ApiPromise.create({ provider: httpProvider, noInitWarn: true });
