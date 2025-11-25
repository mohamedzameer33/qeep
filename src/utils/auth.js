// src/utils/auth.js  (or auth.jsx — both work)

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isLoggedIn = () => {
  return !!getToken();
};

// Simple & safe way to get userId from JWT without any external library
export const getUserId = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];           // Get middle part (payload)
    const decoded = JSON.parse(atob(payload));     // Decode base64 → object
    return decoded.sub || decoded.userId || decoded.id || null;
  } catch (e) {
    console.error("Invalid token format");
    return null;
  }
};

export const getUsername = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.username || null;
  } catch (e) {
    return null;
  }
};

// Add this function at the bottom of auth.js
export const debugToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("NO TOKEN IN LOCALSTORAGE");
    return;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("TOKEN PAYLOAD:", payload);
    console.log("EXPIRES:", new Date(payload.exp * 1000));
    console.log("NOW:", new Date());
  } catch (e) {
    console.log("INVALID TOKEN");
  }
};