import {
  createAsyncThunk,
  createReducer,
} from '@reduxjs/toolkit';
import { extractPublicKey } from '@metamask/eth-sig-util';
import {
  reject,
  eq,
  prop,
} from 'lodash/fp';
import { personalSign } from '@/utils/crypto';
import type { RootState } from './index';

export interface Account {
  publicKey?: `0x${string}`
  addressesInFetching: string[]
}

export const namespace = 'account';
export const selectEntities = prop<RootState, 'account'>(namespace);

export const readPublicKey = createAsyncThunk<`0x${string}`, {
  address: `0x${string}`;
}, { state: RootState }>(
  `${namespace}/readPublicKey`,
  async ({ address }: { address: `0x${string}` }) => {
    const publicKeyMap = window.localStorage.getItem('publicKeyMap');
    let newPublicKeyMap: Record<string, `0x${string}`> = {};
    if (publicKeyMap) {
      newPublicKeyMap = JSON.parse(publicKeyMap);
      if (newPublicKeyMap[address]) {
        return newPublicKeyMap[address];
      }
    }
    const message = 'Get public key';
    const signature = await personalSign(message, address);
    const publicKey = extractPublicKey({
      data: message,
      signature,
    }) as `0x${string}`;
    newPublicKeyMap[address] = publicKey;
    window.localStorage.setItem('publicKeyMap', JSON.stringify(newPublicKeyMap));
    return publicKey;
  },
  {
    condition(
      { address },
      { getState },
    ) {
      const state = getState();
      return !selectEntities(state).addressesInFetching.includes(address);
    },
  },
);

const reducer = createReducer<Account>({ addressesInFetching: [] }, (builder) => {
  builder.addCase(readPublicKey.pending, (draft, { meta: { arg: { address } } }) => {
    draft.addressesInFetching.push(address);
  });
  builder.addCase(readPublicKey.rejected, (draft, { meta: { arg: { address } } }) => {
    draft.addressesInFetching = reject(eq(address))(draft.addressesInFetching);
  });
  builder.addCase(readPublicKey.fulfilled, (draft, { payload, meta: { arg: { address } } }) => {
    draft.publicKey = payload;
    draft.addressesInFetching = reject(eq(address))(draft.addressesInFetching);
  });
});

export default { [namespace]: reducer };
