import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import { CallsListPage, CallDetailsPage, LoginPage } from './pages';
import { Tractor } from '@aircall/tractor';
import './App.css';
import { ProtectedLayout, ProtectedRoute } from './components'; // Ensure AuthenticatedRoute is imported
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks';
import client from './apollo/apolloClient';
import { PublicRoute } from './components/Routing/PublicRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/calls" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
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
      </Routes>
    </AuthProvider>
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
