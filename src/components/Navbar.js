import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">Coffee House</Link>
        <div className="nav-links">
          <Link to="/">Trang chủ</Link>
          <a href="#menu">Menu</a>
          <Link to="/signin" className="auth-btn">Đăng nhập</Link>
          <Link to="/signup" className="auth-btn">Đăng ký</Link>
          <button id="cart-toggle" className="cart-button">
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;