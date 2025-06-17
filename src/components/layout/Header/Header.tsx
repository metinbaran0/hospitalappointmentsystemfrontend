import React from 'react';
import './Header.css';
import hospitalLogo from "./../../png/hospital-appointment.png";

const Header: React.FC = () => {
  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="logo-section">
          <img
            src={hospitalLogo}
            alt="Hospital Appointment System"
            className="hospital-logo"
          />
        </div>
        <div className="title-container">
            <h1>
              <span className="title-highlight">HOSPITAL </span>
              <span className="title-divider"></span>
              <span className="title-secondary">APPOINTMENT SYSTEM </span>
            </h1>
            
          </div>
        
        <nav className="main-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/doctors" className="nav-link">Doctors</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button 
            className="appointment-btn" 
            onClick={() => window.location.href = '/appointment'}
          >
            Make an appointment
          </button>
          
        </nav>
        <div className="auth-buttons">
        <a href="/hospital-panel" className="auth-btn hospital-btn">
          Hospital Panel
        </a>
      </div>
      </div>
    
    </header>
  );
};

export default Header;