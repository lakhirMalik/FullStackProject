import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap routes like /login and /register — if a user is ALREADY logged in,
// skip these pages and send them straight to the dashboard.
export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
