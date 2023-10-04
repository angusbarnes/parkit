import React, { useState } from "react";
import "./navbar.css";

const Navbar = ({ logo, resetButtonCallback }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <a href="/">
                        <img src={logo}></img>
                    </a>
                </div>
                <div className={`navbar-links ${isNavOpen ? "open" : ""}`}>
                    <a href="/">Home</a>
                    <a href="/" onClick={resetButtonCallback}>
                        Reset
                    </a>
                    <a href="/contact">Contact</a>
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
