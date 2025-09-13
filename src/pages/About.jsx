import React from 'react';
import { Link } from 'react-router-dom';

// About page component - converted from about.html
const About = () => {
  return (
    <main className="container content-page">
      <h1>🔹 Who We Are</h1>
      <p>
        At <strong>Mavick</strong>, we believe time is too personal to be mass-produced. 
        That's why we created a space where <em>you</em> become the watchmaker.
      </p>
      <p>
        We're not just a brand — we're a blank canvas. A platform where your creativity, 
        personality, and bold choices take center stage. Our mission? To give you the tools, 
        freedom, and precision craftsmanship to bring your dream watch to life.
      </p>
      
      <hr />

      <h2>🔹 Why the Name 'Mavick'?</h2>
      <p>
        Because it stands for the <strong>maverick</strong> in you — the fearless creator, 
        the style definer, the non-conformist.
      </p>
      <p>
        You don't need a brand to tell you who you are. You just need a place to express it.
      </p>

      <hr />

      <h2>🔹 How It Works</h2>
      <ol className="how-it-works">
        <li>
          <strong>Choose Your Base</strong> – Start with a case shape and movement style.
        </li>
        <li>
          <strong>Customize Everything</strong> – Dials, hands, straps, bezels — all up to you.
        </li>
        <li>
          <strong>Visualize & Order</strong> – See your watch in real-time 3D before you finalize.
        </li>
        <li>
          <strong>Delivered to You</strong> – Your custom watch, precision-assembled and 
          delivered to your doorstep.
        </li>
      </ol>

      <hr />
      
      <h2>🔹 Our Promise</h2>
      <p>
        Every Mavick is built with <strong>premium materials</strong>, <strong>Swiss-level mechanics</strong>, 
        and <strong>a soul that's 100% yours</strong>. Because time should look like <em>you.</em>
      </p>
      <div className="button-group">
        <Link to="/cad" className="btn btn-primary">→ Design Your Mavick Now</Link>
      </div>
    </main>
  );
};

export default About;