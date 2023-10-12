import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LoginPage } from "../pages/Login/Login";
import { ProtectedRoute } from "../components/routing/ProtectedRoute";
import { ProtectedLayout } from "../components/routing/ProtectedLayout";
import { CallsListPage } from "../pages/CallsList/CallsList";
import { CallDetailsPage } from "../pages/CallDetails/CallDetails";

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
