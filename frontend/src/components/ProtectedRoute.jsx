import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Only lets logged in users through, and optionally only a specific role
export function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

// Keeps logged in users away from the login and register pages
export function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}
