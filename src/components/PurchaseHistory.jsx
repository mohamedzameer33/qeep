import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './Footer';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('qeep_userId');



  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/game/purchase-history');
        setHistory(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [userId]);



  if (loading) return <div style={{textAlign:'center', padding:'100px', color:'white'}}>Loading History...</div>;

 
  return (

    
    <div style={{minHeight:'100vh', background:'#2e0909ff', color:'white'}}>
      <Header />

      <div style={{padding:'20px'}}>
        
        <h1 style={{textAlign:'center', fontSize:'42px', color:'#c2fd43', margin:'20px 0'}}>Buy History</h1>

        {history.length === 0 ? 
          <p style={{textAlign:'center', fontSize:'28px', color:'#888', marginTop:'100px'}}>No purchases yet</p>
          :
          <div style={{maxWidth:'500px', margin:'0 auto'}}>
            {history.map((log, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.1)',
                padding:'20px',
                borderRadius:'20px',
                marginBottom:'15px',
                textAlign:'center'
              }}>
                <p style={{fontSize:'20px', margin:'8px 0'}}>
                  <strong style={{color:'#c2fd43'}}>{log.buyer}</strong> bought <strong style={{color:'#FF4500'}}>{log.pet}</strong>
                </p>
                <p style={{fontSize:'24px', color:'#FFD700', fontWeight:'bold'}}>
                  {log.price} coins
                </p>
                <p style={{fontSize:'16px', color:'#aaa', marginTop:'10px'}}>
                  {new Date(log.time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        }
      </div>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;