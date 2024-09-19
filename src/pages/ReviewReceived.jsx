import React from 'react';

//dette komponent er skrevet med en Implicit return. I arrow functions kan du fjerne return-nøgleordet og {}-parenteserne, hvis funktionen kun har én expression. 
//Sådan en bruges ofte, når funktionen er enkel og kun består af en enkelt return statement

const ReviewReceived = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2>Tak for din anmeldelse!</h2>
    <p>Vi bliver bare så glade når folk gider give sig tid til den slags.</p>
  </div>
);

export default ReviewReceived;
