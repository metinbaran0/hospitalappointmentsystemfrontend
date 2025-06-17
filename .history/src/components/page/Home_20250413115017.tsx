import React from 'react';
import Header from '../components/layout/Header/Header';
import Hero from '../components/sections/Hero/Hero';
import Services from '../components/sections/Services/Services';
import Doctors from '../components/sections/Doctors/Doctors';
import Contact from '../components/sections/Contact/Contact';
import Footer from '../components/layout/Footer/Footer';

import './css/Global.css';

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