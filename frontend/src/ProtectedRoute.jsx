import { Navigate } from 'react-router-dom';
import { getToken } from './api';

export default function ProtectedRoute({ children }) {
  const authed = !!getToken();
  return authed ? children : <Navigate to="/login" replace />;
}
