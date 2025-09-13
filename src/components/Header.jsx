import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Header component with navigation - converted from the original HTML nav structure
const Header = () => {
  const location = useLocation();

  // Helper function to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header>
      <nav className="container">
        {/* Logo - links to home page */}
        <Link to="/" className="logo">MAVICK</Link>
        
        {/* Navigation menu */}
        <ul>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/cad" 
              className={`cad-link ${isActive('/cad') ? 'active' : ''}`}
            >
              CAD Software
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;