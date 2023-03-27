import {
  configureStore,
  TypedStartListening,
} from '@reduxjs/toolkit';
import {
  useDispatch,
  TypedUseSelectorHook,
  useSelector,
} from 'react-redux';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppSelector = TypedUseSelectorHook<RootState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: AppSelector = useSelector;

const store = configureStore({
  reducer: {},
});

export default store;
