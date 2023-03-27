import React, {} from 'react';
import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import Layout from './components/layout';
import RouteElement from './components/route-element';

export default function App() {
  const router = createHashRouter([{
    path: '/',
    element: <Layout />,
    children: [{
      path: '',
      element: <RouteElement ignoreAuth load={() => import('./pages/index')} />,
    }],
  }]);

  return <RouterProvider router={router} />;
}
