import {
  ApiPromise,
  HttpProvider,
} from '@polkadot/api';

// export const httpProvider = new HttpProvider('http://3.122.90.113:9911');
export const httpProvider = new HttpProvider('http://44.192.29.2:9933');

export const apiPromise = ApiPromise.create({ provider: httpProvider, noInitWarn: true });
