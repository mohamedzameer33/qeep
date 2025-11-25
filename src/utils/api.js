// // src/utils/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log('[API] Token added:', token.substring(0, 20) + '...');  // Debug
//   } else {
//     console.log('[API] No token found!');  // Debug
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('[API ERROR]', error.response?.status, error.response?.data?.message);  // Debug
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;