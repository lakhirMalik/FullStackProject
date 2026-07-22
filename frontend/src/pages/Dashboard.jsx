import { useEffect, useState } from 'react';
import { getProfile } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [liveEvents, setLiveEvents] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This call goes through the axios interceptor — token attached automatically.
    // If the token is invalid/expired, the response interceptor auto-redirects to /login.
    getProfile()
      .then((data) => setProfile(data.user))
      .catch(() => setError('Could not load profile'));
  }, []);

  useEffect(() => {
    // LISTEN — receive real-time events pushed FROM the server
    const handleUserLoggedIn = (data) => {
      console.log('📡 userLoggedIn event received:', data);
      setLiveEvents((prev) => [
        `${data.email} logged in at ${new Date(data.time).toLocaleTimeString()}`,
        ...prev,
      ]);
    };

    socket.on('userLoggedIn', handleUserLoggedIn);

    // Cleanup on unmount — prevents duplicate listeners on re-render
    return () => {
      socket.off('userLoggedIn', handleUserLoggedIn);
    };
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
      <button onClick={() => navigate('/chat')} style={{ marginLeft: '0.5rem' }}>
        💬 Chat with AI
      </button>

      <div style={{ marginTop: '1.5rem' }}>
        <h4>Live Activity</h4>
        {liveEvents.length === 0 && <p style={{ color: '#888' }}>No activity yet</p>}
        <ul>
          {liveEvents.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}