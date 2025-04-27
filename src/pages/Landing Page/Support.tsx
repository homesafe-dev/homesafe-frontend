import React from 'react';
import Hero from '../../components/LandingPage/Support/Hero';
import Footer from '../../components/LandingPage/Home/Footer';
import Help from '../../components/LandingPage/Support/Help';
import Map from '../../components/LandingPage/Support/Map';
import MessageForm from '../../components/LandingPage/Support/MessageForm';

const Support = () => {
  return (
    <div>
      <Hero />
      <Help />
      <MessageForm />
      <Map />
      <Footer />
    </div>
  );
};

export default Support;
