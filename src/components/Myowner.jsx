import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './Footer';
import { FaCoins } from 'react-icons/fa';

const MyOwner = () => {
  const [ownerName, setOwnerName] = useState('FREE');
  const [ownerValue, setOwnerValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const myUid = localStorage.getItem('qeep_uid');

  useEffect(() => {
    if (!myUid) {
      alert("Login first!");
      window.location.href = '/login';
      return;
    }

    const fetchOwner = async () => {
      try {
        const res = await axios.get('/api/pet/list');
        const users = res.data;

        const me = users.find(u => u.uid === myUid);
        if (!me) {
          setLoading(false);
          return;
        }

        if (me.ownerUid && me.ownerUid !== null && me.ownerUid !== '') {
          const owner = users.find(u => u.uid === me.ownerUid);
          if (owner) {
            setOwnerName(owner.username);
            setOwnerValue(owner.price); // OWNER'S PET VALUE (how much he costs)
          } else {
            setOwnerName("Ghost Master");
            setOwnerValue(999);
          }
        } else {
          setOwnerName("FREE");
          setOwnerValue(0);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load owner:", err);
        setOwnerName("Error");
        setLoading(false);
      }
    };

    fetchOwner();
    const interval = setInterval(fetchOwner, 3000);
    return () => clearInterval(interval);
  }, [myUid]);

  const isOwned = ownerName !== "FREE" && ownerName !== "Error" && ownerName !== "Ghost Master";

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#2e0909ff',
        color: '#c2fd43',
        textAlign: 'center',
        paddingTop: '200px',
        fontSize: '40px',
        fontWeight: 'bold'
      }}>
        Loading Your Master...
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#2e0909ff', display:'flex', flexDirection:'column'}}>
      <Header />

      <div style={{flex:1, padding:'20px', paddingBottom:'100px'}}>
        <h1 style={{
          textAlign:'center',
          fontSize:'52px',
          color:'#c2fd43',
          margin:'30px 0',
          fontWeight:'bold',
          textShadow: '0 0 20px #c2fd43'
        }}>
          My Owner
        </h1>

        <div style={{maxWidth:'420px', margin:'40px auto'}}>
          <div style={{
            background:'white',
            padding:'50px',
            borderRadius:'40px',
            textAlign:'center',
            boxShadow:'0 30px 70px rgba(0,0,0,0.7)',
            border: isOwned ? '10px solid #DC143C' : '10px solid #32CD32'
          }}>
            <img 
              style={{
                borderRadius:"50%",
                width:'180px',
                height:'180px',
                objectFit:'cover',
                border: isOwned ? '12px solid #DC143C' : '12px solid #32CD32',
                boxShadow: isOwned ? '0 0 40px #DC143C' : '0 0 40px #32CD32'
              }}
              src="https://bamstechnologies.org/qeep--/images/user.png"
              alt="Owner"
            />

            <h2 style={{
              fontSize:'56px',
              margin:'30px 0 10px',
              fontWeight:'bold',
              color: isOwned ? '#DC143C' : '#32CD32',
              textShadow: isOwned ? '0 0 25px #DC143C' : '0 0 25px #32CD32'
            }}>
              {ownerName}
            </h2>

            {isOwned ? (
              <div style={{marginTop:'50px'}}>
                <p style={{color:'#ffc400ff', fontSize:'32px', margin:'15px 0', fontWeight:'bold'}}>
                  Owner's Pet Value
                </p>
                <p style={{
                  fontSize:'68px',
                  fontWeight:'bold',
                  color:'#ffc400ff',
                  textShadow: '0 0 40px #ffc400ff',
                  margin:'15px 0'
                }}>
                  <FaCoins style={{fontSize:'60px'}} /> {ownerValue} Zp
                </p>
                <p style={{color:'#ff69b4', fontSize:'22px', marginTop:'20px', fontWeight:'bold'}}>
                  That's how much your master is worth in the market!
                </p>
              </div>
            ) : (
              <div style={{marginTop:'50px'}}>
                <p style={{
                  fontSize:'52px',
                  color:'#32CD32',
                  fontWeight:'bold',
                  textShadow: '0 0 35px #32CD32'
                }}>
                  YOU ARE FREE
                </p>
                <p style={{color:'#aaa', fontSize:'24px', marginTop:'15px'}}>
                  No one owns your soul
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyOwner;