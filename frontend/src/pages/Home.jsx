import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/content/home')
      .then((res) => setContent(res.data))
      .catch(() => setError('Could not load page content'));
  }, []);

  return (
    <div className="auth-container">
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chat">Chat</Link>
      </nav>

      {error && <p className="error">{error}</p>}

      {content ? (
        <>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </>
      ) : (
        !error && <p>Loading...</p>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {user ? (
          <Link to="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
        <Link to="/about">
          <button>About</button>
        </Link>
      </div>
    </div>
  );
}