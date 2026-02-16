// src/Admin/AdminDashboard.jsx — FINAL FULLY PATCHED VERSION

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [giftTarget, setGiftTarget] = useState(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const myUid = localStorage.getItem('qeep_uid') || 'QP0000111';

  // 🔥🔥 Normalize "isMaster" ALWAYS — this is the fix
  const normalizeUser = (u) => ({
    ...u,
    isMaster: u.isMaster === true || u.isMaster === 1 || u.isMaster === "1"
  });

  // REFRESH FUNCTION — RELOADS USERS AFTER EVERY ACTION
  const refreshUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/pet/list`);
      const allRaw = res.data;

      // 🔥 Normalize all users
      const all = allRaw.map(normalizeUser);

      const me = all.find(u => u.uid === myUid);

      if (!me) {
        alert('User not found');
        navigate('/login');
        return;
      }

      const isQeepMaster = me.uid === 'QP0000111';
      const isSmallMaster = me.isMaster === true;

      if (!isQeepMaster && !isSmallMaster) {
        alert('Access Denied');
        navigate('/myprofile');
        return;
      }

      setCurrentUser(me);
      setUsers(all.filter(u => u.uid !== myUid));
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert('Backend not running');
    }
  };

  useEffect(() => {
    if (!myUid) {
      navigate('/login');
      return;
    }

    refreshUsers();  // INITIAL LOAD
    const interval = setInterval(refreshUsers, 5000); // AUTO REFRESH

    return () => clearInterval(interval);
  }, [myUid, navigate]);

  const sendGift = async () => {
    if (!giftAmount || giftAmount < 1) return alert('Enter amount');
    try {
      await axios.post(`${API}/api/admin/gift`, {
        from: myUid,
        to: giftTarget.username,
        coins: parseInt(giftAmount)
      });

      localStorage.setItem('qeep_latest_gift', JSON.stringify({
        to: giftTarget.uid,
        coins: parseInt(giftAmount)
      }));

      alert(`Gifted ${giftAmount} ZP to ${giftTarget.username}!`);
      setGiftAmount('');
      setGiftTarget(null);
      refreshUsers(); // REFRESH AFTER GIFT
    } catch (err) {
      alert('Only QEEPMaster can gift');
    }
  };

  const promoteToSmallMaster = async (uid) => {
    if (!confirm('Promote to Small Master?')) return;
    try {
      await axios.post(`${API}/api/admin/promote`, { admin: myUid, target: uid });
      alert('Promoted!');
      refreshUsers();  // REFRESH — Button becomes DEMOTE instantly
    } catch (err) {
      alert('Promote failed');
    }
  };

  const demoteSmallMaster = async (uid) => {
    if (!confirm('Demote this Small Master?')) return;
    try {
      await axios.post(`${API}/api/admin/demote`, { admin: myUid, target: uid });
      alert('Demoted!');
      refreshUsers();
    } catch (err) {
      alert('Only QEEPMaster can demote');
    }
  };

  const deleteUser = async (uid) => {
    if (!confirm('DELETE FOREVER?')) return;
    try {
      await axios.post(`${API}/api/admin/delete`, { admin: myUid, target: uid });
      alert('Deleted!');
      refreshUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: '#000', color: '#0f0', fontSize: '28px' }}>
      LOADING GOD MODE...
    </div>
  );

  const isQeepMaster = currentUser?.uid === 'QP0000111';

  return (
    <div style={{ height: '100%', background: 'linear-gradient(135deg, #0a001a, #000)', color: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ background: 'linear-gradient(45deg, #ff0066, #ff8c00)', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>
          {isQeepMaster ? 'QEEPMaster' : 'SMALL MASTER'} PANEL
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '18px' }}>{currentUser?.username}</p>
      </div>

      {/* GIFT POPUP — ONLY QEEPMaster */}
      {giftTarget && isQeepMaster && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
          zIndex: 999, display: 'grid', placeItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #111, #222)', border: '3px solid #ff0066',
            borderRadius: '24px', padding: '35px', width: '85%', maxWidth: '360px'
          }}>
            <h2 style={{ color: '#ff0066', fontSize: '28px', textAlign: 'center', margin: '0 0 25px 0' }}>
              GIFT TO {giftTarget.username}
            </h2>

            <input
              type="number"
              placeholder="Enter ZP Amount"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              style={{
                width: '100%', padding: '18px', fontSize: '22px',
                background: '#000', color: 'white',
                border: '2px solid #ff0066', borderRadius: '16px', textAlign: 'center'
              }}
            />

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button onClick={sendGift} style={{
                flex: 1, padding: '18px', background: '#ff0066', color: 'white',
                fontSize: '22px', fontWeight: 'bold', borderRadius: '16px'
              }}>
                SEND GIFT
              </button>

              <button onClick={() => { setGiftTarget(null); setGiftAmount(''); }} style={{
                flex: 1, padding: '18px', background: '#333', color: 'white',
                fontSize: '20px', borderRadius: '16px'
              }}>
                CANCEL
              </button>
            </div>

          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {users.map(u => {
          const isTargetSmallMaster = u.isMaster === true; // normalized already!

          return (
            <div key={u.uid} style={{
              background: 'linear-gradient(135deg, rgba(255,0,102,0.15), rgba(255,140,0,0.1))',
              border: '2px solid rgba(255,0,102,0.5)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '15px'
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#ff8c00' }}>
                    {u.username}
                    {isTargetSmallMaster && (
                      <span style={{ color: '#00ff80', marginLeft: '8px' }}>[Small Master]</span>
                    )}
                  </h3>

                  <p style={{ margin: '4px 0', fontSize: '14px', opacity: 0.8 }}>UID: {u.uid}</p>

                  <p style={{ margin: '8px 0 0 0', fontSize: '18px' }}>
                    Balance: <span style={{ color: '#00ff80', fontWeight: 'bold' }}>
                      {u.coins?.toLocaleString() || 0} ZP
                    </span>
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                  {isQeepMaster && (
                    <button onClick={() => setGiftTarget(u)} style={{
                      background: 'linear-gradient(45deg, #ff0066, #ff8c00)',
                      color: 'white', padding: '10px 16px',
                      border: 'none', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 'bold'
                    }}>
                      GIFT
                    </button>
                  )}

                  {/* MAKE MASTER (only if NOT master) */}
                  {!isTargetSmallMaster && u.uid !== 'QP0000111' && (
                    <button onClick={() => promoteToSmallMaster(u.uid)} style={{
                      background: '#00ff80', color: 'black',
                      padding: '8px 14px', border: 'none',
                      borderRadius: '10px', fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      MAKE MASTER
                    </button>
                  )}

                  {/* DEMOTE (only if IS master) */}
                  {isQeepMaster && isTargetSmallMaster && u.uid !== 'QP0000111' && (
                    <button onClick={() => demoteSmallMaster(u.uid)} style={{
                      background: '#ff8c00', color: 'black',
                      padding: '8px 14px', border: 'none',
                      borderRadius: '10px', fontSize: '13px'
                    }}>
                      DEMOTE
                    </button>
                  )}

                  {/* DELETE USER */}
                  {u.uid !== 'QP0000111' && (
                    <button onClick={() => deleteUser(u.uid)} style={{
                      background: '#ff1744', color: 'white',
                      padding: '8px 14px', border: 'none',
                      borderRadius: '10px', fontSize: '13px'
                    }}>
                      DELETE
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '15px', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate('/myprofile')} style={{
          width: '100%', padding: '18px',
          background: 'linear-gradient(45deg, #333, #111)',
          color: '#00ff80', border: '2px solid #00ff80',
          borderRadius: '18px', fontSize: '20px',
          fontWeight: 'bold'
        }}>
          ← BACK TO PROFILE
        </button>
      </div>

    </div>
  );
}
