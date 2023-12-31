import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import JobListPage from './components/JobListPage';
import JobDetailPage from './components/JobDetailPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="jobs" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="jobs" element={isLoggedIn ? <JobListPage onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/jobs/:id" element={<JobDetailPage onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
