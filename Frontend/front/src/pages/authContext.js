// authContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const updateLoginStatus = (isLoggedIn, isAdmin) => {
    setLoggedIn(isLoggedIn);
    setIsAdmin(isAdmin);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, updateLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
