import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)  ;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("Token from localStorage:", token); // ✅ DEBUG
  
        if (!token) {
          // console.log("No token found, setting loading false");
          setLoading(false);
          return;
        }
  
        const res = await axios.get("http://localhost:3000/api/user/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // console.log("Verify response:", res); // ✅ DEBUG
  
        if (res.data.success) {
          setUser(res.data.user);
          // console.log("User set:", res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        // console.error("Token verification failed", err); // ✅ DEBUG
        setUser(null);
      } finally {
        // console.log("Setting loading to false"); // ✅ DEBUG
        setLoading(false);
      }
    };
  
    verifyUser();
  }, []);
  


  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
