import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './ContactPage.module.scss';

const ContactPage = () => {
   // State til at gemme medarbejdere og formulardata
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee: '',
    message: '',
  });
  const navigate = useNavigate(); // Hook til navigering

  // Henter medarbejdere fra Supabase (til select-feltet) når komponenten mountes
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data: employees, error } = await supabase.from('employees').select('id, firstname');
      if (!error) {
        setEmployees(employees); // Opdaterer state med hentede medarbejdere
      } else {
        console.error('Fejl ved hentning af medarbejdere:', error);
      }
    };
    fetchEmployees();
  }, []); //tomt dependency array sikrer, at den kun kører én gang ved mount

  // Håndterer formularinput
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destrukturering af event-objektet
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Opdaterer det specifikke felt i formData
    }));
  };

  // Håndterer indsendelse af formular
  const handleSubmit = async (e) => {
    e.preventDefault();// Forhindrer standardformularindsendelse

    const { name, email, employee, message } = formData;
    if (!name || !email || !employee || !message) {
      alert('Alle felter skal udfyldes!');
      return;
    }

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      employee_id: employee,
      message,
      created_at: new Date(), // Automatisk tilføjelse af tidspunkt så man ved hvor gamme beskeden er
    });

    if (!error) {
      navigate('/besked-modtaget');
    } else {
      console.error('Fejl ved afsendelse af besked:', error);
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.formSection}>
        <h1>Kontakt</h1>
        <p>Udfyld og send formularen, og vi vil hurtigst muligt besvare dine spørgsmål.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Navn</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="employee">Medarbejder</label>
            <select
              id="employee"
              name="employee"
              value={formData.employee}
              onChange={handleInputChange}
              required
            >
              <option value="">Vælg en medarbejder</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message">Besked</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Send besked</button>
        </form>
      </div>
      <div className={styles.mapSection}>
        <p>Find os her:</p>
        <iframe
          title="Kort over Øster Uttrupvej 1"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps?q=Øster+Uttrupvej+1,+9000+Aalborg&output=embed"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
