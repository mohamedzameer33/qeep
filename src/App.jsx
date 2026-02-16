// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Personalprofile from './components/Personalprofile';
import SpinWheel from './components/SpinWheeel'; // Fixed typo: SpinWheeel → SpinWheel
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import TicTacToe from './components/Tictactoe';
import FriendZoo from './components/FriendZoo'; // Fixed: .module → .jsx
import Zoo from './components/Zoo';
import Myowner from './components/Myowner';
import Myzoo from './components/Myzoo';
import Myprofile from './components/Myprofile';
import PurchaseHistory from './components/PurchaseHistory.Jsx';
import Userprofile from './components/Userprofile';
import AdminDashboard from './Admin/AdminDashboard';
import SmallMasterPanel from './Admin/SmallMasterPanel';

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
              <Zoo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/petshop"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FriendZoo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myowner"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Myowner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myzoo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Myzoo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Myprofile />
            </ProtectedRoute>
          }
        />
        <Route
path="/profile/:username"           element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Userprofile />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/purchasehistory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SmallMasterPanel />
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