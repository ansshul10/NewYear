import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import OurJourney from './pages/OurJourney';
import TreatMenu from './pages/TreatMenu';

function App() {
  return (
    <Router>
      <Routes>
        {/* Sabse pehle Landing Page dikhega */}
        <Route path="/" element={<Landing />} />
        
        {/* Landing se yahan aayenge */}
        <Route path="/journey" element={<OurJourney />} />
        
        {/* Journey se yahan aayenge */}
        <Route path="/treats" element={<TreatMenu />} />
      </Routes>
    </Router>
  );
}

export default App;