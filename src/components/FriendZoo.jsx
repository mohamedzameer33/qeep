// src/components/FriendZoo.jsx — FINAL 100% FIXED
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FriendZoo() {
  const [coins, setCoins] = useState(0);
  const [myValue, setMyValue] = useState(20);
  const [currentOwner, setCurrentOwner] = useState('None');
  const [myPets, setMyPets] = useState([]);
  const [marketUsers, setMarketUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem('qeep_userId');
  const myUserId = parseInt(userId);

  const refreshAllData = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/game/user?id=${myUserId}`),
        axios.get('http://localhost:8080/api/game/users')
      ]);

      const myData = myRes.data;
      const allUsers = allRes.data;

      setCoins(myData.coins);
      setMyValue(myData.petValue);
      setCurrentOwner(
        myData.currentOwnerId
          ? allUsers.find(u => u.id === myData.currentOwnerId)?.username || 'Someone'
          : 'Free'
      );

      setMyPets(allUsers.filter(u => u.currentOwnerId === myUserId));
      setMarketUsers(
        allUsers.filter(u => u.id !== myUserId && u.currentOwnerId !== myUserId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    refreshAllData().then(() => setLoading(false));
  }, [userId]);

  const buyPet = async (petId) => {
    const pet = marketUsers.find(u => u.id === petId);
    if (!pet) return;
    if (coins < pet.petValue) return alert("Not enough coins!");
    if (!window.confirm(`Buy ${pet.username} for ${pet.petValue} coins?`)) return;

    try {
      await axios.post(`http://localhost:8080/api/game/buy?buyerId=${myUserId}&petId=${petId}`);
      await refreshAllData();  // ONLY BACKEND DECIDES PRICE
      alert(`You bought ${pet.username} for ${pet.petValue} coins!`);
    } catch (err) {
      alert(err.response?.data || "Can't buy this pet");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'white'}}>
        <h1 style={{fontSize:'48px'}}>Login Required</h1>
        <button onClick={() => navigate('/login')} style={{marginTop:'30px', padding:'18px 50px', background:'#FF6B6B', border:'none', borderRadius:'50px', color:'white', fontSize:'24px', cursor:'pointer'}}>
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', color:'#333'}}>Loading Zoo...</div>;

  return (
    <div style={{padding:'40px', background:'linear-gradient(to bottom,#87CEEB,#E0FFFF)', minHeight:'100vh', fontFamily:'Arial, sans-serif'}}>
      <h1 style={{textAlign:'center', fontSize:'50px', color:'#333'}}>Friend Zoo</h1>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'25px', margin:'40px 0'}}>
        <div style={{background:'white', padding:'30px', borderRadius:'20px', textAlign:'center', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'}}>
          <h3 style={{color:'#FFD700'}}>Your Coins</h3>
          <p style={{fontSize:'50px', fontWeight:'bold', color:'#FFD700'}}>{coins}</p>
        </div>
        <div style={{background:'white', padding:'30px', borderRadius:'20px', textAlign:'center', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'}}>
          <h3 style={{color:'#FF69B4'}}>Your Value</h3>
          <p style={{fontSize:'50px', fontWeight:'bold', color:'#FF1493'}}>{myValue}</p>
        </div>
        <div style={{background:'white', padding:'30px', borderRadius:'20px', textAlign:'center', boxShadow:'0 10px 25px rgba(0,0,0,0.2)'}}>
          <h3 style={{color:'#4169E1'}}>Your Owner</h3>
          <p style={{fontSize:'38px', color:currentOwner==='Free'?'#32CD32':'#DC143C', fontWeight:'bold'}}>{currentOwner}</p>
        </div>
      </div>

      <h2 style={{fontSize:'36px', margin:'40px 0 20px', color:'#333'}}>My Pets ({myPets.length})</h2>
      {myPets.length === 0 ? <p style={{textAlign:'center', fontSize:'28px', color:'#888'}}>Zoo empty!</p> :
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'25px'}}>
          {myPets.map(pet => (
            <div key={pet.id} style={{background:'white', padding:'25px', borderRadius:'20px', textAlign:'center'}}>
              <div style={{fontSize:'90px'}}>Pet</div>
              <h3 style={{fontSize:'28px'}}>{pet.username}</h3>
              <p>Value: {pet.petValue} coins</p>
              <p style={{color:'#32CD32', fontWeight:'bold'}}>Owned by YOU</p>
            </div>
          ))}
        </div>
      }

      <h2 style={{fontSize:'36px', margin:'50px 0 20px', color:'#333'}}>Market</h2>
      {marketUsers.length === 0 ? <p style={{textAlign:'center', fontSize:'28px', color:'#666'}}>You own everyone!</p> :
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'25px'}}>
          {marketUsers.map(user => (
            <div key={user.id} style={{background:'white', padding:'25px', borderRadius:'20px', textAlign:'center'}}>
              <div style={{fontSize:'80px'}}>{user.currentOwnerId ? 'Pet' : 'Person'}</div>
              <h3 style={{fontSize:'26px'}}>{user.username}</h3>
              <p>Price: <strong style={{color:'#FF4500'}}>{user.petValue}</strong> coins</p>
              <button onClick={() => buyPet(user.id)} style={{
                marginTop:'15px', padding:'14px 32px',
                background: user.currentOwnerId ? '#FF4500' : '#32CD32',
                color:'white', border:'none', borderRadius:'30px', fontSize:'18px', fontWeight:'bold', cursor:'pointer'
              }}>
                {user.currentOwnerId ? `Steal for ${user.petValue}` : `Buy for ${user.petValue}`}
              </button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}