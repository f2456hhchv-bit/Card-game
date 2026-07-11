import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { ApiError } from '../api/client';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [callsign, setCallsign] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(email, username, callsign, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="brand-title">NOVA CITY</h1>
        <p className="brand-tagline">Pick a callsign. Make a name for yourself out here.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Username
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Callsign
            <input type="text" value={callsign} onChange={(e) => setCallsign(e.target.value)} required />
          </label>
          <label>
            Password (6+ characters)
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Launching…' : 'Create pilot'}
          </button>
        </form>
        <p className="auth-switch">
          Already flying? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
