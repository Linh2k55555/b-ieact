import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = styled.nav`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: ${(props) => (props.scrolled ? "#333" : "transparent")};
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 5px; 
  
  a {
    color: white;
    text-decoration: none;
    padding: 5px 10px; 
    font-size: 0.95rem; 
    transition: 0.3s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
    }
  }
`;


const Carousel = styled.div`
  height: 450px;
  position: relative;
  overflow: hidden;
`;

const CarouselItem = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => (props.active ? "0%" : "100%")};
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.8s ease-in-out;
`;

const BannerOverlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  color: white;
  max-width: 500px;
`;

const Button = styled.a`
  background: #f39c12;
  color: white;
  padding: 10px 15px;
  display: inline-block;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 10px;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

const ProductsSection = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

// Định nghĩa các styled-components bị thiếu
const FooterContainer = styled.footer`
  background: #222;
  color: white;
  padding: 40px 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  text-align: left;
  h4 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  p, a {
    color: #ccc;
    font-size: 0.9rem;
    text-decoration: none;
    display: block;
    margin-bottom: 8px;
    &:hover {
      color: white;
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
  border-top: 1px solid #444;
  margin-top: 20px;
  padding-top: 10px;
  font-size: 0.85rem;
  color: #aaa;
`;


const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const slides = [
    {
      title: "Khám Phá Hương Vị Cà Phê",
      description: "Trải nghiệm những tách cà phê thượng hạng từ khắp nơi trên thế giới",
      buttonText: "Xem Menu",
      link: "#menu",
      image: "https://www.pixelstalk.net/wp-content/uploads/2016/05/Coffee-beans-cup-wallpaper-hd.jpg",
    },
    {
      title: "Không Gian Thư Giãn",
      description: "Tận hưởng không gian ấm cúng và yên tĩnh cùng những người thân yêu",
      buttonText: "Tìm Hiểu Thêm",
      link: "#about",
      image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e",
    },
    {
      title: "Ưu Đãi Đặc Biệt",
      description: "Khám phá những ưu đãi hấp dẫn dành riêng cho thành viên",
      buttonText: "Xem Ngay",
      link: "#",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
    },
  ];

  useEffect(() => {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 50));
    return () => window.removeEventListener("scroll", () => setScrolled(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
    axios.get("/api/auth/check", { withCredentials: true }).then((res) => setIsAuthenticated(res.data.isAuthenticated));
  }, [setIsAuthenticated]);
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    
    // Thực hiện hành động thêm vào giỏ hàng nếu đã đăng nhập
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };
  return (
    <div>
      {/* Navbar */}
      <Navbar scrolled={scrolled}>
        <Logo to="/">Coffee House</Logo>
        <NavLinks>
          <Link to="/">Trang chủ</Link>
          <a href="#menu">Menu</a>
          <Link to="/signin">Đăng nhập</Link>
          <Link to="/signup">Đăng ký</Link>
        </NavLinks>
      </Navbar>

      {/* Banner */} 
      <Carousel>
        {slides.map((slide, index) => (
          <CarouselItem key={index} active={index === currentIndex} style={{ backgroundImage: `url(${slide.image})` }}>
            <BannerOverlay>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <Button href={slide.link}>{slide.buttonText}</Button>
            </BannerOverlay>
          </CarouselItem>
        ))}
      </Carousel>

      {/* Products Section */}
      <ProductsSection id="menu">
        <h2>Menu của chúng tôi</h2>
        <ProductsGrid>
    {products.map((product) => (
      <ProductCard key={product._id}>
        <ProductImage src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
        <Button onClick={() => handleAddToCart(product)}>Thêm vào giỏ hàng</Button>
      </ProductCard>
    ))}
  </ProductsGrid>
);

      </ProductsSection>

      {/* Footer */}
      <FooterContainer>
        <FooterContent>
          <FooterSection>
            <h4>Về Coffee House</h4>
            <p>Chúng tôi là điểm đến lý tưởng cho những người yêu thích cà phê chất lượng cao và không gian ấm cúng.</p>
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
  <a href="https://www.facebook.com"><i className="bi bi-facebook"></i></a>
  <a href="https://www.instagram.com"><i className="bi bi-instagram"></i></a>
  <a href="https://www.twitter.com"><i className="bi bi-twitter"></i></a>
</SocialLinks>
          </FooterSection>
        </FooterContent>

        <Copyright>
          <p>&copy; 2024 Coffee House. All rights reserved.</p>
        </Copyright>
      </FooterContainer>
    </div>
  );
};


export default HomePage;
