import {
  createBrowserRouter,
  createRoutesFromElements,
  LoaderFunction,
  Outlet,
  redirect,
  Route
} from 'react-router-dom';
import { ProtectedLayout } from '../components/protectedLayout/ProtectedLayout';
import { PublicLayout } from '../components/publicLayout/PublicLayout';
import CallDetailsPage from '../pages/CallDetails';
import CallsListPage from '../pages/CallList';
import LoginPage from '../pages/Login';

const redirectIfUser: LoaderFunction = ({ request }) => {
  const { pathname } = new URL(request.url);
  const accessToken = window.localStorage.getItem('access_token');
  if (accessToken) return redirect('/calls');
  if (pathname !== '/login') return redirect('/login');
};

const redirectIfNoUser: LoaderFunction = () => {
  const accessToken = window.localStorage.getItem('access_token');
  if (!accessToken) return redirect('/login');
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PublicLayout />} loader={redirectIfUser}>
        <Route path="/" element={<Outlet />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedLayout />} loader={redirectIfNoUser}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);
