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
          <Link to="/">
            <img src={logo}></img>
            <div>
            <span className="mainlogo">ParkIT</span>
            <span className="sublogo">SOLUTIONS</span>
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
