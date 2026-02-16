import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './Footer';
import { FaCoins, FaGlobeAsia, FaCat, FaUserFriends } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [ownerName, setOwnerName] = useState('FREE');
  const [petCount, setPetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/pet/list'); // Real API
        const allUsers = res.data;

        const foundUser = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (!foundUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(foundUser);

        // OWNER NAME
        if (foundUser.ownerUid) {
          const owner = allUsers.find(u => u.uid === foundUser.ownerUid);
          setOwnerName(owner ? owner.username : "Someone");
        } else {
          setOwnerName("FREE");
        }

        // PETS OWNED COUNT
        const pets = allUsers.filter(u => u.ownerUid === foundUser.uid);
        setPetCount(pets.length);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#2b092bff',
        color: '#c2fd43',
        textAlign: 'center',
        paddingTop: '200px',
        fontSize: '36px',
        fontWeight: 'bold'
      }}>
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#2b092bff',
        color: '#ff3366',
        textAlign: 'center',
        paddingTop: '200px',
        fontSize: '40px',
        fontWeight: 'bold'
      }}>
        User Not Found
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#2b092bff', color:'white', display:'flex', flexDirection:'column'}}>
      <Header />
      
      <div style={{flex:1, padding:'30px 0px', textAlign:'center'}}>
        <img 
          style={{
            borderRadius:"50%",
            width:'150px',
            height:'150px',
            border:'5px solid #c2fd43',
            margin:'20px 0',
            boxShadow: '0 0 30px rgba(194, 253, 67, 0.6)'
          }}
          src="https://bamstechnologies.org/qeep--/images/user.png" 
          alt="Profile"
        />
        
        <h1 style={{
          textTransform: "uppercase",
          fontSize: '34px',
          color: '#c2fd43',
          margin: '10px 0',
          fontWeight: 'bold',
          textShadow: '0 0 15px #c2fd43'
        }}>
          {user.username}
        </h1>
        
        <h2 style={{
          fontFamily:'monospace',
          fontSize: '18px',
          color: '#aaa',
          margin: '5px 0'
        }}>
          UID: {user.uid}
        </h2>

        <h1 style={{fontSize: '26px', color: '#FF69B4', margin: '20px 0'}}>
          <FaCat style={{marginRight:'10px'}} /> Value: {user.price} Zp
        </h1>

        <h1 style={{fontSize: '26px', color: '#DC143C', margin: '15px 0'}}>
          <FaUserFriends style={{marginRight:'10px', position:"relative", top:"4px"}} /> 
          Owner: <strong style={{color: ownerName === "FREE" ? '#32CD32' : '#ff3366'}}>{ownerName}</strong>
        </h1>

        <h1 style={{fontSize: '26px', color: '#32CD32', margin: '15px 0'}}>
          <FaCat style={{marginRight:'10px', position:"relative", top:"1px"}} /> 
          Pets Owned: <strong>{petCount}</strong>
        </h1>

        <h1 style={{fontSize: '22px', color: '#f8f8f8ff', margin: '20px 0'}}>
          <FaGlobeAsia style={{marginRight:'10px', position:"relative", top:"4px"}} /> India
        </h1>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;