import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import AccessPortal from './pages/AccessPortal';
import ClientLayout from './components/ClientLayout';
import AdminLayout from './components/AdminLayout';

// Client pages
import HomePage from './pages/client/HomePage';
import RoutineView from './pages/client/RoutineView';
import DietView from './pages/client/DietView';
import SchedulePage from './pages/client/SchedulePage';
import ContactPage from './pages/client/ContactPage';
import MembershipPage from './pages/client/MembershipPage';
import ProfilePage from './pages/client/ProfilePage';

// Admin pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DietsAdmin from './pages/admin/DietsAdmin';
import RoutinesAdmin from './pages/admin/RoutinesAdmin';

// ---- Ruta protegida ----
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/acceso" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/cliente'} replace />;
  }
  return children;
};

// ---- Root redirect ----
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/acceso" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/cliente'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/acceso" element={<AccessPortal />} />

        {/* ---- Rutas de Cliente ---- */}
        <Route path="/cliente" element={
          <ProtectedRoute requiredRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="rutina" element={<RoutineView />} />
          <Route path="dieta" element={<DietView />} />
          <Route path="horarios" element={<SchedulePage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="membresia" element={<MembershipPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>

        {/* ---- Rutas de Admin ---- */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardAdmin />} />
          <Route path="dietas" element={<DietsAdmin />} />
          <Route path="rutinas" element={<RoutinesAdmin />} />
        </Route>

        {/* ---- Default ---- */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
