// src/pages/Contact.jsx
import { useState } from 'react';
import supabase from '../../supabase';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Alle felter skal udfyldes');
      return;
    }
    const { error } = await supabase.from('contact').insert([formData]);
    if (error) {
      setErrorMessage('Der opstod en fejl. Prøv igen.');
    } else {
      setErrorMessage(null);
      // Redirect til svarside
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Navn" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input type="email" placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <textarea placeholder="Besked" onChange={e => setFormData({ ...formData, message: e.target.value })} />
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit">Send</button>
    </form>
  );
};

export default Contact;
