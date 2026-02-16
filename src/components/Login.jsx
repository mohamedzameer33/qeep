import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = "http://localhost:8080";   // ✅ REAL BACKEND

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        username: form.username.trim(),
        password: form.password
      });

      const data = res.data;

      // Save user details
      localStorage.setItem('qeep_uid', data.uid);
      localStorage.setItem('qeep_username', data.username);
      localStorage.setItem('qeep_coins', data.coins || 100);
      localStorage.setItem('qeep_isMaster', data.isMaster ? "1" : "0");
      localStorage.setItem('qeep_isQeepMaster', data.isQeepMaster ? "1" : "0");

      setIsAuthenticated(true);
      setMessage(`Welcome back ${data.username}!`);

      setTimeout(() => {
        navigate('/welcome');
      }, 1200);

    } catch (err) {
      const backendError =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid username or password';

      setMessage(backendError.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>QEEP Login</h2>
        <div style={styles.logo}>QEEP ZOO</div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Entering Zoo...' : 'ENTER QEEP'}
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.message,
            color: message.includes('Welcome') ? '#00ff9d' : '#ff3366'
          }}>
            {message}
          </p>
        )}

        <p style={styles.switch}>
          New slave?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>
            Register Here
          </span>
        </p>

        <div style={styles.hint}>
          Hint: Login as <b>QeepMaster</b> / <b>qeep123</b>
        </div>
      </div>
    </div>
  );
};

// --- styles unchanged ---

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Comic Sans MS", cursive, sans-serif'
  },
  card: {
    background: 'white',
    padding: '50px 40px',
    borderRadius: '30px',
    boxShadow: '0 20px 50px rgba(255,105,180,0.5)',
    width: '420px',
    maxWidth: '90%',
    textAlign: 'center',
    border: '6px solid #ff69b4'
  },
  logo: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: '20px'
  },
  title: {
    margin: '0 0 10px',
    color: '#ff1493',
    fontSize: '36px',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },
  input: {
    padding: '18px',
    border: '4px solid #ffb6c1',
    borderRadius: '20px',
    fontSize: '18px',
    background: '#fff0f5'
  },
  button: {
    padding: '20px',
    background: '#ff69b4',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  message: {
    marginTop: '25px',
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '12px',
    borderRadius: '10px'
  },
  switch: {
    marginTop: '30px',
    color: '#666',
    fontSize: '17px'
  },
  link: {
    color: '#ff69b4',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  hint: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#ff69b4',
    fontWeight: 'bold'
  }
};

export default Login;
