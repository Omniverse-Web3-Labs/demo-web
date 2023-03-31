import {
  ApiPromise,
  HttpProvider,
} from '@polkadot/api';

export const httpProvider = new HttpProvider('http://35.158.224.2:9911');

export const apiPromise = ApiPromise.create({ provider: httpProvider, noInitWarn: true });
