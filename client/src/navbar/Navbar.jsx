import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ logo }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand button-group">
          <Link to="/" className="logo">
                <img src ={logo} alt="My Happy SVG" style={{height: '35px', marginRight: '8px'}}/>
                {/* Park<b>IT</b> */}
            <div>
            <span className="mainlogo">ParkIT</span>
            <span className="sublogo">Booking Manager</span>
          </div>
          </Link>
        </div>
        <div className={`navbar-links ${isNavOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/Dashboard">Dashboard</Link>
        </div>
        <div className="navbar-toggle" onClick={toggleNav}>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
