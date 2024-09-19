import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import supabase from '../../supabase';
import { AuthContext } from '../providers/AuthContext';
import styles from './Login.module.scss';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { user, error } = await login(email, password);
    if (user) {
      setSuccess("Du er logget ind.");
      setEmail("");
      setPassword("");
      navigate('/minside');
    } else {
      setError(error ? error.message : "Login mislykkedes.");
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000); // Timeout for succes- og fejlbeskeder
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signUp({ email: registerEmail, password: registerPassword });
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess("Super, du er oprettet. Du kan nu logge ind.");
      setEmail(registerEmail); // Overfør registreret email til login-feltet
      setRegisterEmail("");
      setRegisterPassword("");
      setIsRegistering(false); // Skift til login-form med det samme
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000); // Timeout for succes- og fejlbeskeder
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.loginContainer}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        
        {!isRegistering ? (
          <form className={styles.form} onSubmit={handleLogin}>
            <p className={styles.infoText}>Indtast email og password for at logge ind.</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='Password'
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.button}>Log ind</button>
            <button
              type="button"
              className={`${styles.button} ${styles.registerButton}`}
              onClick={() => setIsRegistering(true)}
            >
              Opret bruger
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegister}>
            <p className={styles.infoText}>Opret dig som bruger her</p>
            <div className={styles.formGroup}>
              <input
                placeholder='Email'
                type="email"
                className={styles.input}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                placeholder='Password'
                type="password"
                className={styles.input}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.button} >Opret</button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setIsRegistering(false)}
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
