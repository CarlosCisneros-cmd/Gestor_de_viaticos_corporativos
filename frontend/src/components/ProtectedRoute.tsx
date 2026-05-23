import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Definimos los tipos de las propiedades que recibirá el componente
interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Si el usuario ni siquiera ha iniciado sesión, lo rebota al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si el usuario está logueado pero su rol no está permitido en esta ruta
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Si todo está en orden, le permite ver los componentes internos (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
