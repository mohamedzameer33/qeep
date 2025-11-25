// src/components/SpinWheel.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SpinWheel({ onCoinsUpdate }) {
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [canSpin, setCanSpin] = useState(true);

  const userId = localStorage.getItem('qeep_userId');

  useEffect(() => {
    if (!userId) return;
    const today = new Date().toDateString();
    const lastSpin = localStorage.getItem('qeep_last_spin');
    if (lastSpin === today) {
      setCanSpin(false);
      setMessage('You already spun today! Come back tomorrow');
    }
  }, [userId]);

  const spin = async () => {
    if (spinning || !canSpin || !userId) return;

    setSpinning(true);
    setMessage('Spinning...');

    try {
      const res = await axios.post(`http://localhost:8080/api/game/spin?userId=${userId}`);
      const won = parseInt(res.data.match(/(\d+)/)[0], 10);

      setMessage(`JACKPOT! +${won} Coins!`);
      onCoinsUpdate(won); // Instant update in parent

      localStorage.setItem('qeep_last_spin', new Date().toDateString());
      setCanSpin(false);
    } catch (err) {
      setMessage(err.response?.data || 'Already spun today!');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      fontFamily: '"Segoe UI", sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(15px)',
        borderRadius: '30px',
        padding: '50px 40px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ fontSize: '48px', marginBottom: '10px', fontWeight: 'bold' }}>
          Daily Spin Wheel
        </h2>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
          Win 10–100 coins • 1 free spin per day!
        </p>

        <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto 40px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '14px solid #333',
            background: 'conic-gradient(#FF6B6B 0% 10%, #4ECDC4 10% 20%, #45B7D1 20% 30%, #96CEB4 30% 40%, #FECA57 40% 50%, #FF9FF3 50% 60%, #54A0FF 60% 70%, #5F27CD 70% 80%, #00D2D3 80% 90%, #FF9F43 90% 100%)',
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            transform: spinning ? 'rotate(1800deg)' : 'rotate(0deg)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '70px',
              height: '70px',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              border: '6px solid #333'
            }}></div>
          </div>
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            borderTop: '50px solid #FFD700',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.6))',
            zIndex: 20
          }}></div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || !canSpin}
          style={{
            background: spinning || !canSpin ? '#666' : 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            color: 'white',
            border: 'none',
            padding: '20px 60px',
            fontSize: '28px',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: spinning || !canSpin ? 'not-allowed' : 'pointer',
            boxShadow: '0 12px 30px rgba(255,107,107,0.5)',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '3px'
          }}
        >
          {spinning ? 'SPINNING...' : canSpin ? 'SPIN NOW!' : 'COME BACK TOMORROW'}
        </button>

        {message && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '20px',
            fontSize: '32px',
            fontWeight: 'bold',
            textShadow: '2px 2px 10px rgba(0,0,0,0.5)'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}