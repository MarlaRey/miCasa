// src/components/Footer/Footer.js
import React, { useState } from 'react';
import styles from './Footer.module.scss';
import supabase from '../../../supabase';
import logo from '../../assets/img/Logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_emails')
        .insert([{ email }]);

      if (error) throw error;

      setSuccess('Super! Du vil nu modtage vores nyhedsbreve');
      setEmail('');
      setError('');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Der skete en fejl, prøv igen.');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.leftSide}>
        <img className={styles.logo} src={logo} alt="logo" />
        <address>
          <p>Øster Uttrupvej 1<br />
            9000 Aalborg</p>
          <br />
          <p>Tlf: 12345678<br />
            Email: <a href="mailto:info@bagtanker.dk">info@micasa.dk</a></p>

        </address>
      </div>
      <div className={styles.middle}>
        <nav>
          <ul className={styles.menu}>
            <li><Link to="/" className={styles.menuItem}>Forside</Link></li>
            <li><Link to="/boliger" className={styles.menuItem}>Boliger</Link></li>
            <li><Link to="/kontakt" className={styles.menuItem}>Kontakt</Link></li>
            <li><Link to="/login" className={styles.menuItem}>Login</Link></li>
          </ul>
        </nav>
      </div>
      <div className={styles.rightSide}>
        <h2>Få drømmehuset i din indbakke</h2>
        <p>Tilmeld dig vores nyhedsbrev og få nye boliger sendt direkte til din indbakke</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Indtast din email"
            required
          />
          <button type="submit">Tilmeld</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </footer>
  );
};

export default Footer;
