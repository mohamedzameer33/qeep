import React from 'react'
import "../App.css"
import {FaGamepad,FaSearch,FaCommentAlt,FaUserCircle,FaVideo} from "react-icons/fa";
const Footer = () => {
  return (
    <div className='footer'>
        <div className="tabs" style={{height:"50px"}}>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaGamepad className='icons'/> Game</div>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaSearch  className='icons'/>Search</div>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaVideo  className='icons'/>Live</div>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaCommentAlt  className='icons'/>Chats</div>
            <div className="tab" style={{boxShadow:"0 0 10px rgba(0,0,0,0.2)",}}><FaUserCircle  className='icons'/>Me</div>

        </div>
    </div>
  )
}

export default Footer