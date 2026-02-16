// src/components/MyProfile.jsx — FULLY FIXED WITH isMaster NORMALIZATION

import React, { useEffect, useState } from 'react';
import Header from './header';
import Footer from './Footer';
import { FaCrown } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [ownerName, setOwnerName] = useState('Free');
  const [petCount, setPetCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const myUid = localStorage.getItem('qeep_uid');
  const API = 'http://localhost:8080';

  // 🔥 NORMALIZE FUNCTION — SAME AS IN AdminDashboard
  const normalizeUser = (u) => ({
    ...u,
    isMaster:
      u.isMaster === true ||
      u.isMaster === 1 ||
      u.isMaster === "1" ||
      u.isMaster === "true"
  });

  useEffect(() => {
    if (!myUid) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/pet/list`);
        const rawUsers = res.data;

        // 🔥 normalize all users
        const users = rawUsers.map(normalizeUser);

        const me = users.find(u => u.uid === myUid);
        if (!me) return;

        setUser(me);

        if (me.ownerUid) {
          const owner = users.find(u => u.uid === me.ownerUid);
          setOwnerName(owner ? owner.username : "Someone");
        } else {
          setOwnerName("Free");
        }

        setPetCount(users.filter(u => u.ownerUid === myUid).length);
        setLoading(false);

      } catch (err) {
        console.error(err);
        alert('Backend not running');
      }
    };

    fetchProfile();
    const interval = setInterval(fetchProfile, 5000);
    return () => clearInterval(interval);
  }, [myUid, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'grid', placeItems: 'center', fontSize: '24px', color: '#475569', fontWeight: 'bold' }}>
      Loading Your Empire...
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'grid', placeItems: 'center', color: '#ef4444', fontSize: '20px' }}>
      Error loading profile — Login again
    </div>
  );

  // FIXED — NOW WORKS 100%
  const isQeepMaster = user.uid === 'QP0000111';
  const isSmallMaster = user.isMaster === true; // already normalized!

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '480px', margin: '30px auto', padding: '0 20px' }}>

          {/* Profile Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            marginBottom: '24px'
          }}>
            <img
              src="https://bamstechnologies.org/qeep--/images/user.png"
              alt="Avatar"
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '6px solid #e2e8f0', objectFit: 'cover' }}
            />

            <h1 style={{ margin: '20px 0 8px', fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
              {user.username}
            </h1>

            {/* MASTER BUTTONS */}
            {isSmallMaster && !isQeepMaster && (
              <button
                onClick={() => navigate('/master')}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '16px 0',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 25px rgba(245,158,11,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                <FaCrown style={{ fontSize: '20px' }} />
                SMALL MASTER PANEL
              </button>
            )}

            {isQeepMaster && (
              <button
                onClick={() => navigate('/admin')}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '16px 0',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 25px rgba(220,38,38,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                <FaCrown style={{ fontSize: '20px' }} />
                QEEPMaster PANEL
              </button>
            )}

            <p style={{ color: '#64748b', fontSize: '15px', margin: '16px 0' }}>
              UID: {user.uid}
            </p>
          </div>

          {/* INFO BOXES */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            display: 'grid',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '17px', color: '#475569' }}>
                Pet Value
              </span>
              <strong style={{ fontSize: '20px', color: '#1e293b' }}>{user.price || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '17px', color: '#475569' }}>
                Owner
              </span>
              <strong style={{ fontSize: '18px', color: ownerName === 'Free' ? '#16a34a' : '#dc2626' }}>
                {ownerName}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '17px', color: '#475569' }}>
                Pets Owned
              </span>
              <strong style={{ fontSize: '20px', color: '#1e293b' }}>{petCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '17px', color: '#475569' }}>
                Region
              </span>
              <strong style={{ fontSize: '18px' }}>IN</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 8px' }}>
              <span style={{ fontSize: '18px', color: '#475569', fontWeight: '600' }}>
                Balance
              </span>
              <strong style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b' }}>
                {(user.coins || 0).toLocaleString()} ZP
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div style={{
        padding: '20px',
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          style={{
            width: '100%',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '18px',
            borderRadius: '18px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(239,68,68,0.35)',
            letterSpacing: '0.5px'
          }}
        >
          Logout
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default MyProfile;
