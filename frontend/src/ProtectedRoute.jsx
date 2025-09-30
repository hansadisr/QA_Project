import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // ⬅️ Import PropTypes
import { getToken } from './api';

export default function ProtectedRoute({ children }) {
  const authed = !!getToken();
  return authed ? children : <Navigate to="/login" replace />;
}

// ⬅️ Add the prop validation here
ProtectedRoute.propTypes = {
  // 'children' is the content the route wraps. 'node' covers elements, strings, arrays, etc.
  children: PropTypes.node.isRequired,
};