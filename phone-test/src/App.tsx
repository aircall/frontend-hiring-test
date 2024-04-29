import './App.css';
import { darkTheme } from './style/theme/darkTheme';
import { GlobalAppStyle } from './style/global';

import { Tractor } from '@aircall/tractor';

import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { AuthProvider } from './hooks/useAuth';
import { client } from './gql/client';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedLayout />}>
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
