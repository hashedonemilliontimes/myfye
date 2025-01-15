import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/DesktopHome.tsx';
import MobileApp from './pages/mobileApp/MobileAppHome.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/app" element={<MobileApp/>} />
      </Routes>
    </Router>
  );
}

export default App;
