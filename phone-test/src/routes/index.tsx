import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes as ReactRouters
} from 'react-router-dom';
import { ProtectedLayout } from '../components/routing/ProtectedLayout';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';
import { AuthProvider } from '../hooks/useAuth';
import { CallDetailsPage } from '../pages/CallDetails';
import { CallsListPage } from '../pages/CallsList';
import { LoginPage } from '../pages/Login/Login';

const routes = (
  <Route element={<AuthProvider />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="" element={<ProtectedRoute />}>
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  </Route>
);

export const Routes = () => <ReactRouters>{routes}</ReactRouters>;

const router = createBrowserRouter(createRoutesFromElements(routes));

export default router;
