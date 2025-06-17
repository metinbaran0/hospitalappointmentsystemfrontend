import React from 'react';
import './Services.css';

interface Service {
  icon: string;
  title: string;
  description: string;
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      icon: "🏥",
      title: "24/7 Emergency",
      description: "Round-the-clock emergency medical services with dedicated staff"
    },
    // ... diğer servisler
  ];

  return (
    <section className="services-section">
      <div className="services-header" data-aos="fade-up">
        <h2>Our Services</h2>
        <p>We provide comprehensive healthcare services</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            className="service-card" 
            key={index} 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;