import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/Calls/CallsList';
import { CallDetailsPage } from './pages/Calls/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import AuthService from './services/auth.services';




export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="*" element={<Navigate to="/calls" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {

  const client = AuthService.getClient();


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
