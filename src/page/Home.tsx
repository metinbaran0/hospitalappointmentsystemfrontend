import React from 'react';
import Header from '../components/layout/Header/Header';
import Hero from '../components/section/Hero/Hero';
import Footer from '../components/layout/Footer/Footer';
import './css/Global.css';
import Services from '../components/section/Services/Services';
import Doctors from '../components/section/Doctors/Doctors';
import Contact from '../components/section/Contact/Contact';

const Home = () => {
  return (
   <div>
      <Header />
     <main>
        <Hero />
        <Services />
        <Doctors />
        <Contact />
        </main>
      <Footer />
      </div>
  );
};

export default Home;