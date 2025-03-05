import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Thêm useNavigate vào
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo Bootstrap đã được import
import axios from 'axios'; // Thêm import axios
import '../css/Navbar2.css'; // Đảm bảo file css này đã được import

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook dùng để điều hướng

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout'); // Gọi API logout
      if (response.status === 200) {
        // Nếu đăng xuất thành công, chuyển hướng người dùng về trang đăng nhập
        navigate('/');
        alert("Đăng xuất thành công!");
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert("Có lỗi xảy ra trong khi đăng xuất!");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="nav-container">
        <Link to="/home" className="logo">Coffee House</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span> {/* Hamburger icon */}
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="nav-links">
            <Link to="/home2" className="nav-link">Trang chủ</Link>
            <Link to="#menu" className="nav-link">Menu</Link>
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
              >
                <i className="bi bi-person"></i> {/* User icon */}
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                <Link className="dropdown-item" to="/update-password">Đổi mật khẩu</Link>
                <Link className="dropdown-item" to="/user/update-user">Đổi thông tin</Link>
                <Link className="dropdown-item" to="/transactions/history">Lịch sử giao dịch</Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button> {/* Đăng xuất khi nhấn */}
              </ul>
            </div>
            <button
              id="cart-toggle"
              className="nav-link"
              onClick={() => console.log('Open cart functionality')}
            >
              <i className="fas fa-shopping-cart"></i>
            </button> {/* Cart icon */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
