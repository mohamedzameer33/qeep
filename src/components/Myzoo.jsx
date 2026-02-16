import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './Footer';

const MyZoo = () => {
  const [myPets, setMyPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const myUid = localStorage.getItem('qeep_uid'); // QP0000112 format

  useEffect(() => {
    if (!myUid) {
      alert("Login first!");
      window.location.href = '/login';
      return;
    }

    const fetchMyPets = async () => {
      try {
        const res = await axios.get('/api/pet/list'); // Real API
        const allUsers = res.data;

        // Find pets I own (their ownerUid === myUid)
        const pets = allUsers.filter(user => user.ownerUid === myUid);
        setMyPets(pets);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load pets:", err);
        setLoading(false);
      }
    };

    fetchMyPets();
    const interval = setInterval(fetchMyPets, 5000);
    return () => clearInterval(interval);
  }, [myUid]);

  const nextPet = () => {
    setCurrentIndex(prev => prev < myPets.length - 1 ? prev + 1 : 0);
  };

  const prevPet = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : myPets.length - 1);
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '100px',
        fontSize: '32px',
        color: '#c2fd43',
        background: '#2e0909ff',
        minHeight: '100vh',
        fontFamily: 'Comic Sans MS, cursive'
      }}>
        Loading Your Zoo...
      </div>
    );
  }

  if (myPets.length === 0) {
    return (
      <div style={{minHeight:'100vh', background:'#2e0909ff', display:'flex', flexDirection:'column'}}>
        <Header />
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'white'}}>
          <h2 style={{fontSize:'48px', color:'#c2fd43', margin:'20px 0'}}>My Pets (0)</h2>
          <p style={{fontSize:'28px', color:'#888', fontStyle:'italic'}}>
            Your zoo is empty! Buy some pets in Friend Zoo
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPet = myPets[currentIndex];

  return (
    <div style={{minHeight:'100vh', background:'#2e0909ff', display:'flex', flexDirection:'column'}}>
      <Header />

      <div style={{flex:1, overflowY:'auto', padding:'20px', paddingBottom:'100px'}}>
        <h2 style={{
          fontSize:'42px',
          margin:'20px 0',
          color:'#c2fd43',
          textAlign:'center',
          fontWeight:'bold'
        }}>
          My Pets ({myPets.length})
        </h2>

        <div style={{maxWidth:'380px', margin:'30px auto'}}>
          <div style={{
            background:'white',
            padding:'35px',
            borderRadius:'30px',
            textAlign:'center',
            boxShadow:'0 20px 50px rgba(0,0,0,0.4)',
            color:'#333'
          }}>
            <img 
              style={{
                borderRadius:"50%",
                width:'140px',
                height:'140px',
                objectFit:'cover',
                border:'8px solid #32CD32',
                marginBottom:'20px'
              }}
              src="https://bamstechnologies.org/qeep--/images/user.png"
              alt={currentPet.username}
            />
            <h3 style={{fontSize:'34px', margin:'20px 0', fontWeight:'bold', color:'#333'}}>
              {currentPet.username}
            </h3>
            <p style={{fontSize:'24px', color:'#666'}}>
              UID: <strong style={{color:'#0066cc'}}>{currentPet.uid}</strong>
            </p>
            <p style={{fontSize:'24px', color:'#666'}}>
              Value: <strong style={{color:'#FF4500', fontSize:'28px'}}>{currentPet.price}</strong> Zp
            </p>
            <p style={{color:'#32CD32', fontWeight:'bold', fontSize:'26px', marginTop:'20px'}}>
              Owned by YOU
            </p>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', marginTop:'30px'}}>
            <button onClick={prevPet} style={{
              padding:'16px 35px',
              background:'#666',
              color:'white',
              border:'none',
              borderRadius:'50px',
              fontSize:'18px',
              fontWeight:'bold'
            }}>
              ← Previous
            </button>

            <button onClick={nextPet} style={{
              padding:'16px 35px',
              background:'#32CD32',
              color:'white',
              border:'none',
              borderRadius:'50px',
              fontSize:'18px',
              fontWeight:'bold'
            }}>
              Next →
            </button>
          </div>

          <p style={{textAlign:'center', marginTop:'20px', fontSize:'20px', color:'#aaa'}}>
            {currentIndex + 1} / {myPets.length}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyZoo;