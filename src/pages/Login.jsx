import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import supabase from '../../supabase';
import styles from './Login.module.scss'; // Importerer CSS-moduler for stil
import { AuthContext } from '../providers/AuthContext';

// Login-komponenten håndterer både login og registrering af brugere
const Login = ({ setUser, user }) => {
  // State til at holde brugerens login- og registreringsdata, fejl- og succesbeskeder samt om vi er i login- eller registreringsmode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State til at skifte mellem login og registrering
  const { login } = useContext(AuthContext); // Henter login-funktionen fra AuthContext for at opdatere login-status
  const navigate = useNavigate(); // React Router hook til at navigere programmatisk

  // Funktion til at håndtere login, kaldes når login-formularen indsendes
  const handleLogin = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSuccess("");
      setUser(data.user); // Sætter den autentificerede bruger
      
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            if (error.status === 400) {
                setError('Forkert adgangskode');
            } else {
                throw error;
            }
        } else {
          setSuccess("You have logged in successfully!");
      setError("");
      setEmail("");
      setPassword("");
      login();
      navigate('/minside');
            setUser(data.user); // Sætter den autentificerede bruger
        }
      }
  };
  
  const handleRegister = async (event) => {
    event.preventDefault();
    console.log("Attempting to register with:", registerEmail, registerPassword); // Debug-log
    const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword });
    console.log("Register error:", error); // Debug-log
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess("Du har nu oprettet en bruger og kan logge ind og tilgå MinSide");
      setError("");
      setRegisterEmail("");
      setRegisterPassword("");
      setTimeout(() => {
        setSuccess("");
        navigate('/login');
      }, 3000);
    }
  };
  

  return (   
    <div className={styles.mainContainer}>
      <div className={styles.loginContainer}>        
        {/* Viser fejl- eller succesbesked hvis de er sat */}
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        
        {/* Hvis vi ikke er i registreringsmode, vises login-formularen */}
        {!isRegistering ? (
          <form className={styles.form} onSubmit={handleLogin}>
            <p className={styles.infoText}>Indtast email og password for at logge ind.</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Opdaterer email state ved ændring
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='Password'
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Opdaterer password state ved ændring
                required
              />
            </div>
            <button type="submit" className={styles.button}>Log ind</button> {/* Login-knap */}
            <button
              type="button"
              className={`${styles.button} ${styles.registerButton}`}
              onClick={() => setIsRegistering(true)} // Skifter til registreringsformularen
            >
              Opret bruger
            </button>
          </form>
        ) : (
          // Hvis vi er i registreringsmode, vises registreringsformularen
          <form className={styles.form} onSubmit={handleRegister}>
            <p className={styles.infoText}>Opret dig som bruger her</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)} // Opdaterer registrerings-email state
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='password'
                type="password"
                className={styles.input}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} // Opdaterer registrerings-password state
                required
              />
            </div>
            <button type="submit" className={styles.button}>Opret</button> {/* Registreringsknap */}
            <button
              type="button"
              className={styles.button}
              onClick={() => setIsRegistering(false)} // Skifter tilbage til login-formularen
            >
              Tilbage til login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
