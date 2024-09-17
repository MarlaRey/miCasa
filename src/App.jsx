// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss'; // Importerer globale SCSS-styles.
import Home from './pages/Home';
import EstateDetails from './pages/EstateDetails';
import EstateList from './pages/EstateList';
import Login from './pages/Login';
import Contact from './pages/Contact';
import PageLayout from './components/PageLayout/PageLayout';
import { AuthProvider } from './providers/AuthContext';
import MinSide from './pages/MinSide';


function App() {
  return (
    <AuthProvider>
    <Router>
      <PageLayout> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boliger" element={<EstateList />} />
        <Route path="/boliger/:id" element={<EstateDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/minside" element={<MinSide />} />
      </Routes>
      </PageLayout >
    </Router>
    </AuthProvider>
  );
}

export default App;
