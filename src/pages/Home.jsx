import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';

// Home page component - converted from index.html
// This combines the Hero, Features, and Testimonials sections
const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Testimonials />
    </main>
  );
};

export default Home;