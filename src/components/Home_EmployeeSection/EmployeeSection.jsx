import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import styles from './EmployeeSection.module.scss'; // Importér din SCSS-fil

const EmployeeSection = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        console.error('Error loading employees:', error);
      } else {
        setEmployees(data);
      }
    };

    loadEmployees();
  }, []);

  return (
    <section className={styles.employeeSection}>
      <h2 className={styles.h}>Mød vores ansatte</h2>
      <div className={styles.cardsContainer}>
        {employees.map((employee) => (
          <div key={employee.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={employee.image_url} alt={`${employee.firstname} ${employee.lastname}`} />
              <div className={styles.infoBox}>
              <p>{employee.firstname} {employee.lastname}</p>
              <p>{employee.position}</p>
              <br />
                <p>{employee.phone}</p>
                <p>{employee.email}</p>
              </div>
            </div>
            <div className={styles.info}>
              <h3>{employee.first_name} {employee.last_name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmployeeSection;
