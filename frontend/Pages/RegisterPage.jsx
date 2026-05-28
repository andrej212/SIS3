import { useState } from 'react';

function RegisterPage({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Registration failed.');
      } else {
        setMessage('Registration successful! You can now log in.');
      }
    } catch (error) {
      setMessage('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#f7f8fb',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(16, 24, 40, 0.08)',
        background: '#ffffff',
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: '#374151' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              marginBottom: '18px',
              fontSize: '1rem',
            }}
          />

          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: '#374151' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              marginBottom: '18px',
              fontSize: '1rem',
            }}
          />

          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: '#374151' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              marginBottom: '20px',
              fontSize: '1rem',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center', color: '#6b7280' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563eb',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Login
          </button>
        </div>

        {message && (
          <div style={{ marginTop: '20px', color: message.includes('successful') ? '#166534' : '#b91c1c' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
