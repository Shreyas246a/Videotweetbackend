import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on app load to handle session
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get('http://localhost:8000/api/v1/users/getuser', {
//           withCredentials: true,
//         });
//         setUser(res.data.user);  // Save the user data from the response
//       } catch (err) {
//         setUser(null);  // Set user to null in case of error
//       } finally {
//         setLoading(false);  // Set loading to false after fetching
//       }
//     };
//     fetchUser();
//   }, []);

  const login = async (form) => {
    try {
      console.log(form)
      const res = await axios.post(
        'http://localhost:8000/api/v1/users/login',
        form,{
            withCredentials: true
          }
      );
      setUser(res.data.user);  
      return res.data;
    } catch (err) {
      console.log('Login failed:', err);
      setUser(null);  
      throw err; 
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/users/logout', {}, { withCredentials: true });
      setUser(null);  // Clear user data on logout
    } catch (err) {
      console.log('Logout failed:', err);
      setUser(null);  // Set user to null in case of error
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export default useAuth