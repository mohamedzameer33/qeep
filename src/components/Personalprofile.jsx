import React from 'react'
import Layout from './Layout'
import Header from './header'
import Footer from './Footer'
import bluetick from '../assets/bluetick.png'

const Personalprofile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  const name = loggedInUser ? loggedInUser.name : 'Guest';
  
  return (
    <div className='personalprof'>
        <Header/>
<div className="prof">

    <img src="https://bamstechnologies.org/qeep--/images/personal-profile/banner-image.webp"/>

    <h1> {name}  <img style={{height:"38px",position:"relative",bottom:"-7px"}} src={bluetick} alt="" /></h1>

    <h3>ID: B359151015</h3>
    <h3>Location : Earth</h3>
   <div className="stats">
<h4>8.55k <span>Fan</span></h4>
<h4>3.87k <span>Following</span></h4>
<h4>70k <span>Beans</span></h4>
<h4>108k <span>Diamonds</span></h4>

</div> 
    </div>

        <Footer/>
    </div>
  )
}

export default Personalprofile