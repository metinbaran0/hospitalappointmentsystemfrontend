import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-header" data-aos="fade-up">
        <h2>Contact Us</h2>
        <p>Get in touch with us for any questions</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info" data-aos="fade-right">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Our Location</h3>
              <p>123 Healthcare Street, Medical City, 12345</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone Number</h3>
              <p>+1 234 567 8900</p>
              <p>+1 234 567 8901</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email Address</h3>
              <p>info@hospital.com</p>
              <p>support@hospital.com</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
        
        <form className="contact-form" data-aos="fade-left">
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <input type="tel" placeholder="Your Phone" required />
          </div>
          <div className="form-group">
            <select>
              <option value="">Select Department</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="orthopedics">Orthopedics</option>
            </select>
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" rows={5} required></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;