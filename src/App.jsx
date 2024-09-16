// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss'; // Importerer globale SCSS-styles.
import Home from './pages/Home';
import EstateDetails from './pages/EstateDetails';
import EstateList from './pages/EstateList';
import Login from './pages/Login';
import Contact from './pages/Contact';
import PageLayout from './components/PageLayout';


function App() {
  return (
    <Router>
      <PageLayout> {/* Fast på alle sider */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boliger" element={<EstateList />} />
        <Route path="/boliger/:id" element={<EstateDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </PageLayout >
    </Router>
  );
}

export default App;
