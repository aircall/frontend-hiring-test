import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRedirect } from './AppRedirect';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';
import { Suspense, lazy } from 'react';

const LoginPage = lazy(() => import('./pages/Login/Login'));
const CallsListPage = lazy(() => import('./pages/CallsListPage'));
const CallDetailsPage = lazy(() => import('./pages/CallDetailsPage'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Suspense fallback={<div>Loading...</div>}>
      <Route element={<AuthProvider />} errorElement={<ErrorPage />}>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<AppRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calls" element={<ProtectedRoute />}>
          <Route path="/calls" element={<CallsListPage />} />
          <Route path="/calls/:callId" element={<CallDetailsPage />} />
        </Route>
      </Route>
    </Suspense>
  )
);

export default router;
