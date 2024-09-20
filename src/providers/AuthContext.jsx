import React, { createContext, useState, useEffect } from 'react';
import supabase from '../../supabase';

// Opretter en kontekst til autentificering
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Tilstand til at holde styr på login-status og brugerdata
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Funktion til at kontrollere, om der er en aktiv session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Fejl ved kontrol af session:', error); // Logger fejl
      } else if (session) {
        setIsLoggedIn(true); // Sætter login-status til true
        setUser(session.user); // Gemmer brugerdata fra sessionen
      }
    };
    checkSession(); // Kalder funktionen for at kontrollere session
  }, []); // Kører kun én gang ved første render

  // Login-funktion til autentificering af brugeren
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login-fejl:', error); // Logger login-fejl
      return { user: null, error }; // Returnerer null bruger og fejl
    } else {
      setIsLoggedIn(true); // Sætter login-status til true
      setUser(data.user); // Gemmer den autentificerede bruger
      return { user: data.user, error: null }; // Returnerer bruger og null fejl
    }
  };

  // Logout-funktion til at logge brugeren ud
  const logout = async () => {
    await supabase.auth.signOut(); // Logger brugeren ud fra Supabase
    setIsLoggedIn(false); // Sætter login-status til false
    setUser(null); // Nulstiller brugerdata
  };

  // Giver konteksten videre til børn med login-status og brugerdata
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children} // Renderer børn i konteksten
    </AuthContext.Provider>
  );
};
