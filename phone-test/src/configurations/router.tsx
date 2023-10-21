import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import LoginPage from '../pages/Login';
import { ProtectedLayout } from '../components/routing/ProtectedLayout';
import { CallsListPage } from '../pages/CallsList';
import { CallDetailsPage } from '../pages/CallDetails';
import { Root } from '../pages/Root';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);
