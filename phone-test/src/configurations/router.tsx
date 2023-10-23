import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  redirect,
  Route
} from 'react-router-dom';
import { ProtectedLayout } from '../components/routing/ProtectedLayout';
import { PublicLayout } from '../components/routing/PublicLayout';
import { CallDetailsPage } from '../pages/CallDetails';
import { CallsListPage } from '../pages/CallsList';
import LoginPage from '../pages/Login';

const redirectIfUser = () => {
  const accessToken = window.localStorage.getItem('access_token');
  if (accessToken) return redirect('/calls');
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PublicLayout />} loader={redirectIfUser}>
        <Route path="/" element={<Outlet />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);
