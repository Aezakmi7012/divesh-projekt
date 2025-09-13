import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Header component with navigation - converted from the original HTML nav structure
const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav className="container">
        {/* Logo - links to home page */}
        <Link to="/" className="logo" onClick={closeMenu}>MAVICK</Link>
        
        {/* Mobile menu toggle button */}
        <button 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navigation menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
              onClick={closeMenu}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/cad" 
              className={`cad-link ${isActive('/cad') ? 'active' : ''}`}
              onClick={closeMenu}
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