import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { darkTheme } from 'style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from 'style/global';
import { ApolloProvider } from '@apollo/client';
import { client } from 'config/apolloSetup';
import { AuthProvider } from 'contexts/AuthContext';
import { ErrorBoundary } from 'components/Error/ErrorBoundary';
import { ProtectedRoute } from 'components/routing/ProtectedRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />} errorElement={<ErrorBoundary />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedRoute />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
