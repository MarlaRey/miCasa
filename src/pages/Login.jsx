import React, { useState, useContext } from 'react'; // Importerer nødvendige hooks fra React
import { useNavigate } from 'react-router-dom'; // Importerer hook til navigation
import supabase from '../../supabase'; // Importerer Supabase-klienten til autentifikation
import { AuthContext } from '../providers/AuthContext'; // Importerer kontekst for autentificering
import styles from './Login.module.scss'; 

const Login = () => {
  const [email, setEmail] = useState(""); // Tilstand for login-email
  const [password, setPassword] = useState(""); // Tilstand for login-password
  const [registerEmail, setRegisterEmail] = useState(""); // Tilstand for registrerings-email
  const [registerPassword, setRegisterPassword] = useState(""); // Tilstand for registrerings-password
  const [error, setError] = useState(""); // Tilstand for fejlbeskeder
  const [success, setSuccess] = useState(""); // Tilstand for succesbeskeder
  const [isRegistering, setIsRegistering] = useState(false); // Tilstand for at skifte mellem login og registrering
  const { user, login, logout } = useContext(AuthContext); // Henter brugeroplysninger og autentifikationsfunktioner fra AuthContext
  const navigate = useNavigate(); // Hook til navigation

  // Funktion til at håndtere login
  const handleLogin = async (event) => {
    event.preventDefault(); // Forhindrer standard formularindsendelse
    const { user, error } = await login(email, password); // Kalder login-funktionen
    if (user) {
      setSuccess("Du er logget ind."); // Sætter succesbesked
      setEmail(""); // Nulstiller email-feltet
      setPassword(""); // Nulstiller password-feltet
      navigate('/minside'); // Navigerer til 'minside' efter login
    } else {
      setError(error ? error.message : "Login mislykkedes."); // Håndterer fejl
    }
    setTimeout(() => {
      setError(""); // Nulstiller fejlbesked efter 3 sekunder
      setSuccess(""); // Nulstiller succesbesked efter 3 sekunder
    }, 3000);
  };

  // Funktion til at håndtere registrering
  const handleRegister = async (event) => {
    event.preventDefault(); // Forhindrer standard formularindsendelse
    const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword }); // Kalder Supabase signUp
    if (error) {
      setError(error.message); // Sætter fejlbesked ved fejl
      setSuccess("");
    } else {
      setSuccess("Super, du er oprettet. Du kan nu logge ind."); // Sætter succesbesked ved succes
      setEmail(registerEmail); // Overfører registreret email til login-feltet
      setRegisterEmail(""); // Nulstiller registrerings-email
      setRegisterPassword(""); // Nulstiller registrerings-password
      setIsRegistering(false); // Skifter til login-form
    }
    setTimeout(() => {
      setError(""); // Nulstiller fejlbesked efter 3 sekunder
      setSuccess(""); // Nulstiller succesbesked efter 3 sekunder
    }, 3000);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.loginContainer}>
        {error && <p className={styles.error}>{error}</p>} {/* Viser fejlbesked hvis der er en */}
        {success && <p className={styles.success}>{success}</p>} {/* Viser succesbesked hvis der er en */}
        
        {!isRegistering ? ( // Viser login-form hvis ikke i registreringstilstand
          <form className={styles.form} onSubmit={handleLogin}>
            <p className={styles.infoText}>Indtast email og password for at logge ind.</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Opdaterer email-tilstand
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='Password'
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Opdaterer password-tilstand
                required
              />
            </div>
            <button type="submit" className={styles.button}>Log ind</button>
            <button
              type="button"
              className={`${styles.button} ${styles.registerButton}`}
              onClick={() => setIsRegistering(true)} // Skifter til registreringstilstand
            >
              Opret bruger
            </button>
          </form>
        ) : ( // Viser registreringsform hvis i registreringstilstand
          <form className={styles.form} onSubmit={handleRegister}>
            <p className={styles.infoText}>Opret dig som bruger her</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)} // Opdaterer registrerings-email-tilstand
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='Password'
                type="password"
                className={styles.input}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} // Opdaterer registrerings-password-tilstand
                required
              />
            </div>
            <button type="submit" className={styles.button}>Opret</button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setIsRegistering(false)} // Skifter tilbage til login
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
