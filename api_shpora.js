// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'https://api.example.com/',
//   headers: { 'Content-Type': 'application/json' }
// });

// // Optional: Add an interceptor to inject auth tokens automatically
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = Bearer ${token};
//   return config;
// });

// export default apiClient;

// --------------------------------------------------------------------- //

// import { useState, useCallback } from 'react';
// import apiClient from './client';

// export const useApi = (apiFunc) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const request = useCallback(async (...args) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await apiFunc(...args);
//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [apiFunc]);

//   return { data, error, loading, request };
// };

// ------------------------------------------------------------//

        // src/api/userService.js
// import apiClient from './client';
// export const getUser = (id) => apiClient.get(/users/${id});

        // src/components/UserProfile.jsx
// const { data: user, loading, error, request: fetchUser } = useApi(getUser);

// useEffect(() => {
//   fetchUser(123);
// }, [fetchUser]);

// if (loading) return <Spinner />;
// return <div>{user.name}</div>;
