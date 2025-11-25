import React from 'react'
import Header from './header'
import Sidebars from './Sidebars'
import { Outlet } from 'react-router-dom'
import Profile from './Profile'
import Footer from './Footer'

const Layout = ({setIsAuthenticated}) => {
  return (
    <div>

        <div className="app-container">
          
            <Header setIsAuthenticated={setIsAuthenticated} />
            <Profile/>
                <Sidebars/>
      
                    <Footer/>
                    <Outlet/>
                
      
            </div>
      
    </div>
  )
}

export default Layout