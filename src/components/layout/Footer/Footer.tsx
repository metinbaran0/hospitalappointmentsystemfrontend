import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are dedicated to providing the best healthcare services with modern
            facilities and experienced professionals.
          </p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Our Services</a></li>
            <li><a href="/doctors">Our Doctors</a></li>
            <li><a href="/appointment">Book Appointment</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Departments</h3>
          <ul>
            <li><a href="/cardiology">Cardiology</a></li>
            <li><a href="/neurology">Neurology</a></li>
            <li><a href="/pediatrics">Pediatrics</a></li>
            <li><a href="/orthopedics">Orthopedics</a></li>
            <li><a href="/dental">Dental Care</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              123 Healthcare Street, Medical City, 12345
            </li>
            <li>
              <i className="fas fa-phone"></i>
              +1 234 567 8900
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              info@hospital.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Hospital Appointment System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;