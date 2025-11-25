import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setLoading(true);

    if (form.password !== form.repeatPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', null, {
        params: {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          repeatPassword: form.repeatPassword
        }
      });

      // Success
      localStorage.setItem('qeep_username', res.data.username);
      localStorage.setItem('qeep_userId', res.data.userId);

      setMessage('Account created! Welcome to Qeep Zoo');
      setIsSuccess(true);

      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      const errMsg = err.response?.data?.message 
                  || err.response?.data 
                  || err.message 
                  || 'Server error. Try again.';
      
      setMessage(typeof errMsg === 'string' ? errMsg : 'Registration failed');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>QEEP Register</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="username" type="text" placeholder="Username *" value={form.username} onChange={handleChange} required disabled={loading} style={styles.input} />
          <input name="email" type="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} disabled={loading} style={styles.input} />
          <input name="password" type="password" placeholder="Password *" value={form.password} onChange={handleChange} required disabled={loading} style={styles.input} />
          <input name="repeatPassword" type="password" placeholder="Repeat Password *" value={form.repeatPassword} onChange={handleChange} required disabled={loading} style={styles.input} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p style={{ ...styles.message, color: isSuccess ? 'green' : '#e74c3c' }}>
            {message}
          </p>
        )}

        <p style={styles.switch}>
          Already have account? <span onClick={() => navigate('/login')} style={styles.link}>Login here</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Segoe UI", Arial, sans-serif' },
  card: { background: 'white', padding: '40px 30px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', width: '380px', textAlign: 'center' },
  title: { margin: '0 0 30px', color: '#333', fontSize: '28px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px', outline: 'none' },
  button: { padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  message: { marginTop: '15px', fontWeight: 'bold' },
  switch: { marginTop: '20px', color: '#666' },
  link: { color: '#667eea', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Register;