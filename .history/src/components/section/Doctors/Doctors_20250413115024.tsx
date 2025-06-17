import React, { useState, useEffect } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import './Doctors.css';

const doctors = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', image: "https://source.unsplash.com/85x85/?doctor,medical" },
  { name: 'Dr. Michael Chen', specialty: 'Neurologist', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Emma Wilson', specialty: 'Dermatologist', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. James Brown', specialty: 'Pediatrician', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Olivia Taylor', specialty: 'Orthopedic', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Liam Davis', specialty: 'General Surgeon', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Sophia White', specialty: 'Psychiatrist', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Benjamin Lee', specialty: 'Oncologist', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Charlotte Harris', specialty: 'Endocrinologist', image: 'https://source.unsplash.com/85x85/?doctor,medical' },
  { name: 'Dr. Ethan Martin', specialty: 'Nephrologist', image: 'https://source.unsplash.com/85x85/?doctor,medical' }
];

const Doctors: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? doctors.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === doctors.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="doctors-carousel">
      <div className="carousel-container">
        
        <div className="carousel-track">
          {doctors.map((doctor, index) => {
            let className = "carousel-item";
            if (index === currentIndex) className += " active-center";
            else if (index === (currentIndex + 1) % doctors.length) className += " active";
            else if (index === (currentIndex - 1 + doctors.length) % doctors.length) className += " cloned active";
            else className += " cloned";

            return (
              <div key={index} className={className}>
                <div className="doctor-card">
                  <img className='doctor-image' src={doctor.image} alt={doctor.name} />
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <span className="specialty">{doctor.specialty}</span>
                    <button className="book-appointment">Book Appointment</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="slider-nav">
        <div className="slider-prev">
        < i className="bi bi-chevron-left"  onClick={handlePrev}></i>
        </div>
        <div className="slider-next">
        <i className="bi bi-chevron-right" onClick={handleNext} ></i>
        
        </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;