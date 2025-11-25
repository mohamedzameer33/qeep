import React from 'react'

import {Link} from 'react-router-dom'
import Profile from './Profile'
import '../App.css'

const Sidebars = () => {
       const allUsers = JSON.parse(localStorage.getItem('userData')) || [];

  // Get the total number of users
  const count = allUsers.length;
    return (
        <div className='sidebar'>
          
            <ul style={{listStyle:"none"}}>  
                <li> <Link to='/friends' style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span> Friends (1/{count})</Link> </li>
                <li> <Link style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
New QMS (13)</Link > </li>
                <li> <Link style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Qeepers online (22,495)</Link> </li>
                <li> <Link  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
People nearby</Link> </li>
                <li> <Link style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Latest photoblogs</Link> </li>
                <li> <Link to='/friendszoo' style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Friend Zoo</Link> </li>
                <li> <Link  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
The big pinboard</Link> </li>
                <li> <Link  style={{textDecoration:"none",color:"black"}}>
 <span className='arrow'>➔</span>
The Hotlist</Link> </li>
                <li> <Link to='freespin'  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Free Spin</Link> </li>
                <li> <Link to='tictactoe'  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Tic Tac Toe</Link> </li>
                <li> <Link  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
Latest qeepers</Link> </li>
                <li> <Link  style={{textDecoration:"none",color:"black"}}> <span className='arrow'>➔</span>
My recent visitors </Link> </li>
            
            </ul>
        </div>
    )
}

export default Sidebars