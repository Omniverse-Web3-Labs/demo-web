import React, { useEffect } from 'react';
import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  useAppDispatch,
} from '@/redux';
import { useAccount } from 'wagmi';
import Layout from './components/layout';
import RouteElement from './components/route-element';
import { readPublicKey } from './redux/account';

const router = createHashRouter([{
  path: '/',
  element: <Layout />,
  children: [{
    path: '',
    element: <RouteElement ignoreAuth load={() => import('./pages/index')} />,
  }],
}]);

export default function App() {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  useEffect(() => {
    if (address) {
      dispatch(readPublicKey({ address }));
    }
  }, [dispatch, address]);

  return <RouterProvider router={router} />;
}
