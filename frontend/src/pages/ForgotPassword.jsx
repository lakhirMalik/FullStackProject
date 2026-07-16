import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetLink('');

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      // Dev-only: shows the reset link directly since no email service is set up.
      // In production this would be emailed instead.
      if (data.resetLink) setResetLink(data.resetLink);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {resetLink && (
        <p>
          <a href={resetLink}>Click here to reset password</a>
        </p>
      )}

      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}
