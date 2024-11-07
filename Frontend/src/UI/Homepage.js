// Homepage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'; // Custom CSS file for additional styling

const Homepage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className="homepage">
      {/* Overlay to darken background for readability */}
      <div className="homepage-overlay"></div>
      <header className="homepage-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUOiZJUHft3khUUwlUWOw_5QutTX26EgdEg&s" alt="App Logo" className="homepage-logo" />
        <h1 className="homepage-title">Taskverse</h1>
      </header>
      
      <main className="homepage-main">
        <p className="homepage-text">
          Simplify your work and increase productivity. Manage tasks effectively, prioritize with ease, and stay organized every step of the way. Start achieving your goals today!
        </p>
        <button className="signup-button" onClick={handleSignUp}>
          Get Started
        </button>
      </main>
    </div>
  );
};

export default Homepage;
