import React, { createContext, useState } from 'react';

// Opretter en ny kontekst for autentificering
export const AuthContext = createContext();

// AuthProvider-komponent, der giver kontekst-værdier til sine børn
export const AuthProvider = ({ children }) => {
  // State til at holde styr på om brugeren er logget ind
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Funktion til at logge brugeren ind
  const login = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email); // Sæt brugerens e-mailadresse ved login
  };

  // Funktion til at logge brugeren ud
  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(''); // Ryd brugerens e-mailadresse ved logout
  };

  return (
    // Leverer kontekst-værdier til komponenter, der bruger AuthContext
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
