import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { CallsListPage, CallDetailsPage, LoginPage } from './pages';
import { Tractor } from '@aircall/tractor';
import './App.css';
import { ProtectedLayout, ProtectedRoute } from './components'; // Ensure ProtectedRoute is imported
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks';
import client from './apollo/apolloClient';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
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
