import React from 'react'
import "../App.css"
import {FaGamepad,FaSearch,FaCommentAlt,FaUserCircle,FaVideo, FaHome} from "react-icons/fa";
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer'>
        <div className="tabs">
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaGamepad className='icons'/> Game</div>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaSearch  className='icons'/>Search</div>
       <Link style={{textDecoration:"none"}} className="tab" to='/welcome'><div  style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaHome  className='icons'/>Home</div></Link>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaCommentAlt  className='icons'/>Chats</div>
  <Link style={{textDecoration:"none"}} className="tab" to='/myprofile'><div  style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaUserCircle  className='icons'/>Me</div></Link>
        </div>
    </div>
  )
}

export default Footer