import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/Navbar2.css';
import CartSidebar from './CartSidebar';  // ✅ Import CartSidebar

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // ✅ Xử lý khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Toggle mở/đóng dropdown menu người dùng
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // ✅ Toggle mở/đóng giỏ hàng
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  // ✅ Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        navigate('/');
        alert("Đăng xuất thành công!");
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert("Có lỗi xảy ra trong khi đăng xuất!");
    }
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/home2" className="logo">Coffee House</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="nav-links">
              <Link to="/home2" className="nav-link">Trang chủ</Link>
              <a href="#menu" className="nav-link">Menu</a>
              
              {/* ✅ Dropdown menu người dùng */}
              <div className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" onClick={toggleDropdown}>
                  <i className="bi bi-person"></i> {/* User icon */}
                </button>
                <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  <Link className="dropdown-item" to="/update-password">Đổi mật khẩu</Link>
                  <Link className="dropdown-item" to="/user/update-user">Đổi thông tin</Link>
                  <Link className="dropdown-item" to="/transactions/history">Lịch sử giao dịch</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                </ul>
              </div>

              {/* ✅ Nút mở giỏ hàng */}
              <button id="cart-toggle" className="nav-link cart-icon" onClick={toggleCart}>
                🛒 Giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Hiển thị giỏ hàng khi cartOpen = true */}
      {cartOpen && <CartSidebar onClose={toggleCart} />}
    </>
  );
};

export default Navbar2;
