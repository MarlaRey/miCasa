import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react'; // useState hook importeres for at håndtere komponentens tilstand.
import './App.scss'; // Importerer globale SCSS-styles.
import Home from './pages/Home';
import EstateDetails from './pages/EstateDetails';
import EstateList from './pages/EstateList';
import Login from './pages/Login';
import Contact from './pages/Contact';
import PageLayout from './components/PageLayout/PageLayout';
import { AuthProvider } from './providers/AuthContext'; // Importér AuthProvider
import MinSide from './pages/MinSide';

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/minside" element={<MinSide />} />
          </Routes>
        </PageLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
