import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react'; // useState hook importeres for at håndtere komponentens tilstand.
import './App.scss'; // Importerer globale SCSS-styles.
import Home from './pages/Home';
import EstateDetails from './pages/EstateDetails';
import EstateList from './pages/EstateList';
import Login from './pages/Login';
import PageLayout from './components/PageLayout/PageLayout';
import { AuthProvider } from './providers/AuthContext'; // Importér AuthProvider
import MinSide from './pages/MinSide';
import ContactPage from './pages/ContactPage';
import MessageReceived from './pages/MessageReceived';

function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthProvider>
      <Router>
        <PageLayout user={user} setUser={setUser}>
          <Routes>
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
            <Route path="/boliger" element={<EstateList />} />
            <Route path="/boliger/:id" element={<EstateDetails />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/besked-modtaget" element={<MessageReceived />} />
            <Route path="/minside" element={<MinSide />} />
          </Routes>
        </PageLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
