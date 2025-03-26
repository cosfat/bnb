"use client";

import { useState, useEffect, createContext, useContext } from "react";

// Kimlik doğrulama için Context oluştur
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Component mount olduğunda localStorage'dan oturum durumunu kontrol et
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      const storedUser = localStorage.getItem("user");
      
      if (storedLoginStatus === "true" && storedUser) {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(storedUser));
      }
      
      setIsLoading(false);
    };
    
    checkLoginStatus();
  }, []);

  // Oturumu kapat
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        setIsLoggedIn, 
        currentUser, 
        setCurrentUser, 
        isLoading,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook olarak kullanım
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 