import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { AuthProvider } from './hooks/useAuth';
import { ApolloClientProvider } from './ApolloClientProvider';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { PATHS } from './constants/paths';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="*" element={<Navigate to={PATHS.LOGIN} replace />} />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.CALLS} element={<ProtectedRoute />}>
        <Route path={PATHS.CALLS} element={<CallsListPage />} />
        <Route path={`${PATHS.CALLS}/:callId`} element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloClientProvider>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloClientProvider>
    </Tractor>
  );
}

export default App;
