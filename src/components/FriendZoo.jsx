import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins } from 'react-icons/fa';
import Header from './header';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function FriendZoo() {
  const [coins, setCoins] = useState(0);
  const [marketUsers, setMarketUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buyMessage, setBuyMessage] = useState('');

  const myUid = localStorage.getItem('qeep_uid');

  useEffect(() => {
    if (!myUid) {
      alert("Login first!");
      window.location.href = '/login';
      return;
    }

    const loadData = async () => {
      try {
        const res = await axios.get('/api/pet/list');
        const users = res.data;

        const me = users.find(u => u.uid === myUid);
        if (me) {
          setCoins(me.coins);
          localStorage.setItem('qeep_coins', me.coins);
        }

        setMarketUsers(users.filter(u => u.uid !== myUid));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [myUid]);

  const buyPet = async (petUid) => {
    try {
      const res = await axios.post('/api/pet/buy', {
        buyerUid: myUid,
        petUid: petUid
      });

      setBuyMessage("SUCCESS! " + res.data);
      setTimeout(() => setBuyMessage(''), 4000);

      // Refresh
      const refresh = await axios.get('/api/pet/list');
      const users = refresh.data;
      const me = users.find(u => u.uid === myUid);
      if (me) setCoins(me.coins);
      setMarketUsers(users.filter(u => u.uid !== myUid));

    } catch (err) {
      setBuyMessage(err.response?.data || "Can't buy this pet!");
      setTimeout(() => setBuyMessage(''), 3000);
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'100px', fontSize:'32px', color:'white', background:'#2e0909ff', minHeight:'100vh'}}>Loading Zoo...</div>;

  if (marketUsers.length === 0) {
    return (
      <div style={{minHeight:'100vh', background:'#2e0909ff', display:'flex', flexDirection:'column'}}>
        <Header />
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'white'}}>
          <h1 style={{fontSize:'48px', color:'#c2fd43'}}>Friend Zoo</h1>
          <h3><FaCoins /> {coins} Zp</h3>
          <p style={{fontSize:'28px', marginTop:'80px'}}>No Pets in Market!</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentUser = marketUsers[currentIndex];
  const isQeepMaster = currentUser.uid === 'QP0000111';
  const isMyPet = currentUser.ownerUid === myUid;

  // OWNER DISPLAY LOGIC
  let ownerText = "FREE PET";
  let ownerColor = '#32CD32';
  if (currentUser.ownerUid) {
    if (currentUser.ownerUid === myUid) {
      ownerText = "OWNED BY YOU";
      ownerColor = '#32CD32';
    } else {
      const owner = marketUsers.find(u => u.uid === currentUser.ownerUid);
      ownerText = `OWNED BY ${owner?.username || "Someone"}`;
      ownerColor = '#DC143C';
    }
  }

  // CAN BUY LOGIC — FIXED!
  const canBuy = !isQeepMaster && !isMyPet;  // You can buy if it's not yours and not QeepMaster

  return (
    <div style={{minHeight:'100vh', background:'#2e0909ff', display:'flex', flexDirection:'column'}}>
      <Header />
      <div style={{flex:1, padding:'20px'}}>
        <h1 style={{textAlign:'center', color:'#c2fd43', fontSize:'35px'}}>Friend Zoo</h1>
        <h3 style={{textAlign:'center', color:'#ffc400ff'}}><FaCoins /> {coins} Zp</h3>

        {buyMessage && (
          <div style={{
            position:'fixed', top:'20px', left:'50%', transform:'translateX(-50%)',
            background: buyMessage.includes('SUCCESS') ? '#32CD32' : '#DC143C',
            color:'white', padding:'15px 30px', borderRadius:'50px',
            fontSize:'20px', fontWeight:'bold', zIndex:9999
          }}>
            {buyMessage}
          </div>
        )}

        <div style={{maxWidth:'380px', margin:'30px auto'}}>
          <div style={{background:'white', padding:'20px', borderRadius:'25px', textAlign:'center', boxShadow:'0 15px 40px rgba(0,0,0,0.5)'}}>
            <img style={{borderRadius:'50%', width:'120px', height:'120px', border:'5px solid #c2fd43'}}
                 src="https://bamstechnologies.org/qeep--/images/user.png" alt="" />

<h3  
  onMouseEnter={() => setHoveredUser(currentUser.username)}
  onMouseLeave={() => setHoveredUser(null)}
  style={{margin:'20px 0', fontSize:'24px', fontWeight:'bold', color:'#333'}}
>
  <Link 
    to={`/profile/${currentUser.username}`}  // This opens UserProfile
    style={{textDecoration:'none', color:'#333'}}
  >
    {currentUser.username}
  </Link>
</h3>

            <p>Value: <strong style={{color:'#FF4500', fontSize:'25px'}}>{currentUser.price}</strong> Zp</p>

            <p style={{
              fontSize:'22px',
              margin:'15px 0',
              color: ownerColor,
              fontWeight: 'bold'
            }}>
              {ownerText}
            </p>

            {isQeepMaster && (
              <p style={{color:'#ff1493', fontWeight:'bold', fontSize:'22px'}}>
                QEEP MASTER — CANNOT BUY
              </p>
            )}

            <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
              <button onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : marketUsers.length - 1)}
                      style={{flex:1, padding:'14px', background:'#666', color:'white', borderRadius:'30px'}}>Previous</button>

              <button 
                onClick={() => buyPet(currentUser.uid)}
                disabled={!canBuy}
                style={{
                  flex:2, padding:'16px',
                  background: canBuy ? '#32CD32' : '#999',
                  color:'white', borderRadius:'50px', fontSize:'20px', fontWeight:'bold',
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: canBuy ? 1 : 0.6
                }}
              >
                {isQeepMaster ? 'GOD' : isMyPet ? 'ALREADY OWNED' : (currentUser.ownerUid ? 'TRADE' : 'BUY PET')}
              </button>

              <button onClick={() => setCurrentIndex(prev => prev < marketUsers.length - 1 ? prev + 1 : 0)}
                      style={{flex:1, padding:'14px', background:'#666', color:'white', borderRadius:'30px'}}>Next</button>
            </div>
          </div>

          <p style={{textAlign:'center', color:'#aaa', marginTop:'15px'}}>
            {currentIndex + 1} / {marketUsers.length}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}