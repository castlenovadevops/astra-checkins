import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout'; 
// 
import SyncCodeComponent from './pages/syncCode'; 

// import DevicesComponent from './pages/Devices';

import NotFound from './pages/Page404';
import { isDeviceRegistered, isLogin } from './utils/protector';
 
import Dashboard from './pages/Dashboard'; 
import SimpleLayout from './layouts/SimpleLayout';
 
import SyncDataComponent from './pages/syncData';
   
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([  
    {
      path: 'syncBusiness',
      element: isDeviceRegistered() ?<Navigate to="/login"/>: <SyncCodeComponent />  
      // element:<DevicesComponent/>
    }, 
    {
      path: 'syncData',
      element: isDeviceRegistered() ? <LogoOnlyLayout /> : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '/syncData/progress', element: <SyncDataComponent /> }, 
      ],
    }, 
    {
      path: 'login',
      element: isDeviceRegistered() ? (!isLogin() ? <SimpleLayout /> : <Navigate to="/app"/>) : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '/login', element: <Dashboard /> }, 
      ],
    }, 
    {
      path: '/',
      element: !isDeviceRegistered() ? <LogoOnlyLayout /> : <Navigate to="/login"/>,
      children: [
        { path: '/', element: <Navigate to="/syncBusiness" /> }, 
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
