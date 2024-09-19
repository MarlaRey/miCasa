import React from 'react';

//dette komponent er skrevet med en Implicit return. I arrow functions kan du fjerne return-nøgleordet og {}-parenteserne, hvis funktionen kun har én expression. 
//Sådan en bruges ofte, når funktionen er enkel og kun består af en enkelt return statement

const MessageReceived = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2>Tak for din besked!</h2>
    <p>Vi har modtaget din besked og vil besvare den hurtigst muligt.</p>
  </div>
);

export default MessageReceived;
