import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">📄 PDF Tools</div>
      <ul className="navbar-links">
        <li><a href="#">Tools</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
