import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from './pages/LandingPage';
import CountiesMap from './pages/CountiesMap';
import ConstituenciesMap from './pages/ConstituenciesMap';
import CountyOfficials from './pages/CountyOfficials';
import AboutPage from './pages/AboutPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/maps/counties" element={<CountiesMap />} />
        <Route path="/maps/constituencies" element={<ConstituenciesMap />} />
        <Route path="/county-officials" element={<CountyOfficials />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  )
}

export default App
