import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>Về Coffee House</h4>
          <p>Chúng tôi là điểm đến lý tưởng cho những người yêu thích cà phê chất lượng cao và không gian ấm cúng.</p>
        </div>
        <div className="footer-section">
          <h4>Liên kết nhanh</h4>
          <a href="/">Trang chủ</a>
          <a href="#menu">Menu</a>
          <a href="#about">Về chúng tôi</a>
          <a href="#contact">Liên hệ</a>
        </div>
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ</p>
          <p>Email: info@coffeehouse.com</p>
          <p>Điện thoại: (084) 123 456 789</p>
        </div>
        <div className="footer-section">
          <h4>Theo dõi chúng tôi</h4>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2024 Coffee House. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;