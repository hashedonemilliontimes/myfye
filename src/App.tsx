import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, HashRouter, Routes, Route as Router, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import GetStarted from './pages/authentication/getStarted';
import LogIn from './pages/authentication/logIn';
import Dashboard from './pages/dashboard';
import { LanguageCodeProps } from './helpers/languageManager';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace={true} />} />
            <Route path="/:lang" element={<Home />} />
            <Route path="/:lang/get-started/" element={<GetStarted />} />
            <Route path="/:lang/log-in/" element={<LogIn />} />
            <Route path="/:lang/dashboard" element={<Dashboard />} />
            <Route path="/:lang/about" element={<About />} />
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App;
