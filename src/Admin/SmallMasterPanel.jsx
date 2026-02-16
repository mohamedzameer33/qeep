// src/Admin/SmallMasterPanel.jsx — FULLY FIXED WITH isMaster NORMALIZATION

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080';

export default function SmallMasterPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const myUid = localStorage.getItem('qeep_uid');

  // 🔥 Normalize isMaster so UI is consistent
  const normalizeUser = (u) => ({
    ...u,
    isMaster:
      u.isMaster === true ||
      u.isMaster === 1 ||
      u.isMaster === "1" ||
      u.isMaster === "true"
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/pet/list`);
      const raw = res.data;

      const all = raw.map(normalizeUser); // 🔥 FIX

      const me = all.find(u => u.uid === myUid);

      if (!me || !me.isMaster) {
        alert('Access Denied');
        navigate('/myprofile');
        return;
      }

      // show all users except QEEPMaster & yourself
      setUsers(all.filter(u => u.uid !== myUid && u.uid !== 'QP0000111'));

    } catch (err) {
      console.error(err);
      navigate('/myprofile');
    }
  };

  const promote = async (uid) => {
    if (!confirm('Promote this user to Small Master?')) return;
    try {
      await axios.post(`${API}/api/admin/promote`, { admin: myUid, target: uid });
      alert('Promoted!');
      fetchUsers(); // refresh to update button
    } catch (err) {
      alert('Failed');
    }
  };

  const deleteUser = async (uid) => {
    if (!confirm('Delete this user?')) return;
    try {
      await axios.post(`${API}/api/admin/delete`, { admin: myUid, target: uid });
      alert('Deleted!');
      fetchUsers(); // refresh
    } catch (err) {
      alert('Failed');
    }
  };

  useEffect(() => {
    if (!myUid || myUid === 'QP0000111') {
      navigate('/myprofile');
      return;
    }

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [myUid, navigate]);

  return (
    <div style={{height:'100%', background:'linear-gradient(135deg, #f59e0b, #d97706)', color:'white', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'20px', textAlign:'center'}}>
        <h1 style={{fontSize:'32px', fontWeight:'900', margin:0}}>SMALL MASTER PANEL</h1>
        <p style={{margin:'8px 0 0', fontSize:'18px'}}>Limited Control: Promote & Delete</p>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'15px'}}>
        {users.map(u => (
          <div key={u.uid} style={{
            background:'rgba(245,158,11,0.2)',
            border:'2px solid #f59e0b',
            borderRadius:'16px',
            padding:'16px',
            marginBottom:'12px'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <h3 style={{margin:0, color:'#fbbf24'}}>{u.username}</h3>
                <p style={{margin:'4px 0', fontSize:'14px', opacity:0.8}}>UID: {u.uid}</p>
                <p style={{margin:'8px 0 0'}}>Balance: {u.coins?.toLocaleString()} ZP</p>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>

                {/* SHOW PROMOTE ONLY IF NOT small master */}
                {!u.isMaster && (
                  <button
                    onClick={() => promote(u.uid)}
                    style={{
                      background:'#10b981',
                      color:'white',
                      padding:'10px 16px',
                      border:'none',
                      borderRadius:'12px',
                      fontWeight:'bold'
                    }}
                  >
                    PROMOTE
                  </button>
                )}

                <button
                  onClick={() => deleteUser(u.uid)}
                  style={{
                    background:'#ef4444',
                    color:'white',
                    padding:'10px 16px',
                    border:'none',
                    borderRadius:'12px'
                  }}
                >
                  DELETE
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'15px', background:'rgba(0,0,0,0.8)'}}>
        <button onClick={() => navigate('/myprofile')} style={{
          width:'100%',
          padding:'18px',
          background:'#333',
          color:'#10b981',
          border:'2px solid #10b981',
          borderRadius:'16px',
          fontSize:'18px',
          fontWeight:'bold'
        }}>
          ← BACK TO PROFILE
        </button>
      </div>
    </div>
  );
}
