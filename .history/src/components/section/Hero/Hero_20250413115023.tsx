import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content" data-aos="fade-up">
        <h1>Your Health, Our Priority</h1>
        <p>Let's make life healthier together</p>
        <button 
          className="cta-button" 
          onClick={() => window.location.href = '/appointment'}
        >
          Book Appointment Now
        </button>
      </div>
    </section>
  );
};

export default Hero;