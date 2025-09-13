import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// Hero section component - converted from the hero section in index.html
const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Time Designed by You. Built for Mavericks.</h1>
        <p className="subheadline">
          Welcome to <strong>Mavick Watches</strong> — where you don't just wear time, you design it. 
          Custom-build your own watch, from the dial to the strap, and let the world see your time 
          through your eyes.
        </p>
        <div className="button-group">
          <Link to="/cad" className="btn btn-primary">→ Start Designing</Link>
          <a href="#" className="btn">→ Explore Our Gallery</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;