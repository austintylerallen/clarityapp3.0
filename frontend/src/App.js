import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import News from './components/News';
import Representatives from './components/Representatives';
import Elections from './components/Elections';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div>
        <header className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Clarity</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/news">News</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/representatives">Representatives</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/elections">Elections</Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                {!isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </header>
        <div className="container mt-4">
          <Routes>
            <Route path="/news" element={<News />} />
            <Route path="/representatives" element={<Representatives />} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<h1 className="text-white">Welcome to Clarity</h1>} />
          </Routes>
        </div>
        <footer className="bg-dark text-white mt-5 p-4 text-center">
          © 2024 Clarity - All Rights Reserved
        </footer>
      </div>
    </Router>
  );
};

export default App;
