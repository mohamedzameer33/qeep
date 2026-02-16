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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (form.password !== form.repeatPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        repeatPassword: form.repeatPassword
      });

      // Success — res.data is object from our backend
      localStorage.setItem('qeep_uid', res.data.uid);
      localStorage.setItem('qeep_username', res.data.username);
      localStorage.setItem('qeep_coins', res.data.coins);

      setMessage('Registered Successfully! Welcome to QEEP ZOO');
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      // THIS FIXES THE CRASH
      const errorMsg = err.response?.data?.message 
                    || err.response?.data 
                    || err.message 
                    || 'Server error, try again!';

      setMessage(typeof errorMsg === 'string' ? errorMsg : 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    }}>
      <div style={{
        background: 'white', padding: '50px 40px', borderRadius: '30px',
        width: '420px', maxWidth: '90%', textAlign: 'center',
        border: '6px solid #ff69b4', boxShadow: '0 20px 50px rgba(255,105,180,0.5)'
      }}>
        <h2 style={{color: '#ff1493', fontSize: '38px', marginBottom: '20px', textShadow: '2px 2px #ff69b4'}}>
          QEEP Register
        </h2>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required 
                 style={{padding: '16px', borderRadius: '20px', border: '4px solid #ffb6c1', fontSize: '18px', background: '#fff0f5'}} />
          <input name="email" type="email" placeholder="Email (optional)" value={form.email} onChange={handleChange}
                 style={{padding: '16px', borderRadius: '20px', border: '4px solid #ffb6c1', fontSize: '18px', background: '#fff0f5'}} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
                 style={{padding: '16px', borderRadius: '20px', border: '4px solid #ffb6c1', fontSize: '18px', background: '#fff0f5'}} />
          <input name="repeatPassword" type="password" placeholder="Repeat Password" value={form.repeatPassword} onChange={handleChange} required
                 style={{padding: '16px', borderRadius: '20px', border: '4px solid #ffb6c1', fontSize: '18px', background: '#fff0f5'}} />

          <button type="submit" disabled={loading} style={{
            padding: '18px', background: '#ff69b4', color: 'white', border: 'none',
            borderRadius: '20px', fontSize: '22px', fontWeight: 'bold', marginTop: '10px',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Creating Account...' : 'JOIN QEEP ZOO'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '25px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: message.includes('Success') || message.includes('Welcome') ? '#00ff9d' : '#ff3366',
            textShadow: message.includes('Success') ? '0 0 10px #00ff9d' : '0 0 10px #ff3366',
            padding: '15px',
            borderRadius: '15px',
            background: 'rgba(0,0,0,0.1)'
          }}>
            {message}
          </p>
        )}

        <p style={{marginTop: '30px', color: '#666', fontSize: '17px'}}>
          Already have account?{' '}
          <span onClick={() => navigate('/login')} style={{color: '#ff69b4', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline'}}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;