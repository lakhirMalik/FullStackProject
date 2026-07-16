import { useEffect, useState } from 'react';
import { getProfile } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This call goes through the axios interceptor — token attached automatically.
    // If the token is invalid/expired, the response interceptor auto-redirects to /login.
    getProfile()
      .then((data) => setProfile(data.user))
      .catch(() => setError('Could not load profile'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}!</p>

      {profile && (
        <div>
          <p>Email: {profile.email}</p>
          <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
