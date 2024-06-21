import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import News from './components/News';
import Representatives from './components/Representatives';
import Elections from './components/Elections';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Clarity</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
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
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          <Routes>
            <Route path="/news" element={<News />} />
            <Route path="/representatives" element={<Representatives />} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/" element={<h1 className="text-white">Welcome to Clarity</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
