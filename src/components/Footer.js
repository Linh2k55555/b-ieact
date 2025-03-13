import React from "react";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

// 🎨 Styled Components
const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 40px 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1000px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
  margin: 20px 0;
  text-align: left;

  h4 {
    color: #f39c12;
    margin-bottom: 15px;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
  }

  a {
    display: block;
    color: #ecf0f1;
    text-decoration: none;
    margin: 5px 0;
    &:hover {
      color: #f39c12;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;

  a {
    font-size: 1.5rem;
    color: #ccc;
    transition: 0.3s;
    
    &:hover {
      color: white;
    }
  }
`;

const Copyright = styled.div`
  margin-top: 20px;
  border-top: 1px solid #555;
  padding-top: 10px;
  font-size: 14px;
  color: #bbb;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h4>Về Coffee House</h4>
          <p>
            Chúng tôi là điểm đến lý tưởng cho những người yêu thích cà phê chất lượng cao và không gian ấm cúng.
          </p>
        </FooterSection>

        <FooterSection>
          <h4>Liên kết nhanh</h4>
          <a href="/">Trang chủ</a>
          <a href="#menu">Menu</a>
          <a href="#about">Về chúng tôi</a>
          <a href="#contact">Liên hệ</a>
        </FooterSection>

        <FooterSection>
          <h4>Liên hệ</h4>
          <p>📍 Địa chỉ: 123 Đường ABC, Quận XYZ</p>
          <p>📧 Email: info@coffeehouse.com</p>
          <p>📞 Điện thoại: (084) 123 456 789</p>
        </FooterSection>

        <FooterSection>
          <h4>Theo dõi chúng tôi</h4>
          <SocialLinks>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter"></i>
            </a>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>&copy; 2024 Coffee House. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
