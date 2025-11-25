import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bluetick from '../assets/bluetick.png';

const Profile = () => {
  const [name, setName] = useState('Guest');
  const location = useLocation();

  useEffect(() => {
    // Get username passed from Login via navigate state
    const userData = location.state;
    if (userData && userData.username) {
      setName(userData.username);
    }
    // Optional: fallback to localStorage if you save it later
    else if (localStorage.getItem('qeep_username')) {
      setName(localStorage.getItem('qeep_username'));
    }
  }, [location]);

  // Save to localStorage so refresh doesn't lose name
  useEffect(() => {
    if (name !== 'Guest') {
      localStorage.setItem('qeep_username', name);
    }
  }, [name]);

  const loggedInUser = name !== 'Guest';

  return (
    <div className='profile'>
      <img 
        className='dp' 
        style={{ borderRadius: "50%" }} 
        src="https://bamstechnologies.org/qeep--/images/user.png" 
        alt="" 
      />
      
      <Link style={{ textDecoration: "none", color: "black" }} to={`/profile/${name}`}>
        <h1 className='zammy'>
          {name}
          {loggedInUser && (
            <img 
              style={{ height: "38px", position: "relative", bottom: "-7px" }} 
              src={bluetick} 
              alt="blue tick" 
            />
          )}
        </h1>
      </Link>
      
      <table className='follow'>
        <thead>
          <tr>
            <th>2500</th>
            <th>100</th>
            <th>1M</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Followers</td>
            <td>Following</td>
            <td>Fans</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;