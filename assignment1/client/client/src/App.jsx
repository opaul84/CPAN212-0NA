import React, { useState } from 'react';
import Resume from './components/Resume';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <nav className="navbar p-3 d-flex justify-content-center">
        <Button onClick={toggleTheme} className="btn-theme-toggle">
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </Button>
      </nav>
      <Resume darkMode={darkMode} />
    </div>
  );
}

export default App;
