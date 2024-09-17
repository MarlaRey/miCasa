import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import supabase from '../../supabase';
import styles from './Login.module.scss'; // Importerer CSS-moduler for stil
import { AuthContext } from '../providers/AuthContext';

// Login-komponenten håndterer både login og registrering af brugere
const Login = () => {
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
    event.preventDefault(); // Forhindrer standard side-refresh ved form-submit
    const { error } = await supabase.auth.signInWithPassword({ email, password }); // Forsøger at logge ind via Supabase
    if (error) {
      setError(error.message); // Hvis der er en fejl, vises den i UI
      setSuccess(""); // Nulstiller eventuelle tidligere succesbeskeder
    } else {
      setSuccess(`You have logged in successfully!`); // Viser succesbesked
      setError(""); // Nulstiller eventuelle tidligere fejlbeskeder
      setEmail(""); // Nulstiller email-feltet
      setPassword(""); // Nulstiller password-feltet
      login(); // Opdaterer login-status i AuthContext
      navigate('/minside'); // Navigerer brugeren til en beskyttet side, f.eks. "min side"
    }
  };

 // Funktion til at håndtere registrering, kaldes når registreringsformularen indsendes
const handleRegister = async (event) => {
  event.preventDefault(); // Forhindrer standard side-refresh ved form-submit
  const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword }); // Forsøger at oprette en ny bruger via Supabase
  if (error) {
    setError(error.message); // Hvis der er en fejl, vises den i UI
    setSuccess(""); // Nulstiller eventuelle tidligere succesbeskeder
  } else {
    setSuccess(`Du har nu oprettet en bruger og kan logge ind og tilgå MinSide`); // Viser succesbesked
    setError(""); // Nulstiller eventuelle tidligere fejlbeskeder
    setRegisterEmail(""); // Nulstiller registrerings-email-feltet
    setRegisterPassword(""); // Nulstiller registrerings-password-feltet

    // Skjuler succesbeskeden efter 3 sekunder og navigerer til login-siden
    setTimeout(() => {
      setSuccess(""); // Fjern succesbesked
      navigate('/login'); // Navigerer brugeren til login-siden
    }, 3000); // 3000 ms = 3 sekunder
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
