import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/Navbar2.css';
import CartSidebar from './CartSidebar';  // ✅ Import CartSidebar

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // ✅ Biến trạng thái giỏ hàng
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen); // ✅ Chỉ mở khi người dùng nhấn vào icon
  };

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
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="nav-container">
          <Link to="/home" className="logo">Coffee House</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="nav-links">
              <Link to="/home2" className="nav-link">Trang chủ</Link>
              <Link to="#menu" className="nav-link">Menu</Link>
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
              {/* ✅ Bấm vào icon này để mở giỏ hàng */}
              <button id="cart-toggle" className="nav-link cart-icon" onClick={toggleCart}>
                🛒 Giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Giỏ hàng chỉ mở khi cartOpen = true */}
      {cartOpen && <CartSidebar onClose={toggleCart} />}
    </>
  );
};

export default Navbar;
