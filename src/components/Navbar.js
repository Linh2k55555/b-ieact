import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="logo">Coffee House</Link>
        <div className="nav-links">
          <Link to="/">Trang chủ</Link>
          <a href="#menu">Menu</a>
          <Link to="/signin" className="auth-btn">Đăng nhập</Link>
          <Link to="/signup" className="auth-btn">Đăng ký</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;