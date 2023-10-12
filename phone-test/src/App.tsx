import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloProvider } from '@apollo/client';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import client from './services/ApolloClient';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path ='/'>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={
        <ProtectedRoute>
          <ProtectedLayout />
        </ProtectedRoute>
      }>
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
        <AuthProvider>
          <RouterProvider router={router} />
          <GlobalAppStyle />
        </AuthProvider>
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
