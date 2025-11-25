import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', null, {
      params: { username: form.username, password: form.password }
    });

const data = res.data;

localStorage.setItem('qeep_username', data.username);   // ← ADD THIS LINE
localStorage.setItem('qeep_userId', data.userId); 

    setMessage('Welcome back to Qeep Zoo!');
    
    setTimeout(() => {
      navigate('/welcome', {
        state: {
          userId: data.userId,
          username: data.username,
          coins: data.coins,
          petValue: data.petValue
        }
      });
    }, 1000);

  } catch (err) {
    setMessage(err.response?.data?.message || 'Wrong username or password!');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>QEEP Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Enter Qeep
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.message,
            color: message.includes('Welcome') ? 'green' : '#e74c3c'
          }}>
            {message}
          </p>
        )}

        <p style={styles.switch}>
          New here?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", Arial, sans-serif'
  },
  card: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
    width: '380px',
    textAlign: 'center'
  },
  title: { margin: '0 0 30px', color: '#333', fontSize: '28px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '14px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: '0.3s'
  },
  button: {
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  message: { marginTop: '15px', fontWeight: 'bold' },
  switch: { marginTop: '20px', color: '#666' },
  link: { color: '#667eea', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Login;