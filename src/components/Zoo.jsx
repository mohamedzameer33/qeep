import React, { useEffect, useState } from 'react';
import Header from './header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Zoo = () => {
  const [myPetsCount, setMyPetsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const myUid = localStorage.getItem('qeep_uid'); // QP0000112

  useEffect(() => {
    if (!myUid) {
      setMyPetsCount(0);
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        const res = await axios.get('/api/pet/list'); // Real working API
        const users = res.data;

        // Count how many users have ownerUid === myUid
        const count = users.filter(user => user.ownerUid === myUid).length;
        setMyPetsCount(count);
      } catch (err) {
        console.error("Failed to load pet count:", err);
        setMyPetsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000); // Refresh every 5 sec
    return () => clearInterval(interval);
  }, [myUid]);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: '#2b092bff',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER */}
        <div style={{flexShrink: 0}}>
          <Header />
        </div>

        {/* MAIN CONTENT */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '100px'
        }}>
          <div style={{
            background: '#2b092bff',
            minHeight: '80vh',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <img 
              src="https://bamstechnologies.org/qeep--/images/friend-zoo.webp" 
              alt="Friend Zoo" 
              style={{
                marginTop:"10px",
                height:"110px",
                marginBottom: '20px'
              }}
            />

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              width:"390px",
              textAlign: 'left'
            }}>
              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link 
                  className='brown' 
                  to='/petshop' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span> Pet Shop
                </Link>
              </li>

              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link 
                  className='brown' 
                  to='/myzoo' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span>
                  My Zoo ({loading ? '...' : myPetsCount})
                </Link>
              </li>

              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link 
                  className='brown' 
                  to='/myowner' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span> My Owner
                </Link>
              </li>

              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link to='/myprofile'
                  className='brown' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span> My Profile
                </Link>
              </li>

              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link 
                  className='brown' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span> My Zoo Friends
                </Link>
              </li>

              <li className='zooline' style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '20px'
              }}>
                <Link 
                  className='brown' 
                  style={{
                    textDecoration: 'none', 
                    color: '#c2fd43',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className='arrow' style={{marginRight: '45px', fontSize: '24px'}}>→</span> Hall of Fame
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{flexShrink: 0}}>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Zoo;