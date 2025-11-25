// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Personalprofile from './components/Personalprofile';
import SpinWheel from './components/SpinWheeel'; // Fixed typo: SpinWheeel → SpinWheel
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import TicTacToe from './components/Tictactoe';
import FriendZoo from './components/FriendZoo'; // Fixed: .module → .jsx

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in (via JWT token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Optional: Auto logout on token expiry (advanced)
  // You can decode JWT and check exp later

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
          
              <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/register" 
          element={
           
              <Register />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/welcome/zammy-zaif"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Personalprofile />
            </ProtectedRoute>
          }
        />
<Route
  path="/welcome/freespin"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <SpinWheel onCoinsUpdate={(newCoins) => {
        // Refresh coins in Zoo or global state
        // For now, reload page or use a global state like Context
        window.location.reload();  // Simple refresh to update UI
      }} />
    </ProtectedRoute>
  }
/>


        <Route
          path="/welcome/tictactoe"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TicTacToe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friendszoo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FriendZoo />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;