import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Home.css';

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      title: 'Khám Phá Hương Vị Cà Phê',
      description: 'Trải nghiệm những tách cà phê thượng hạng từ khắp nơi trên thế giới',
      buttonText: 'Xem Menu',
      link: '#menu',
      image: 'https://www.pixelstalk.net/wp-content/uploads/2016/05/Coffee-beans-cup-wallpaper-hd.jpg'
    },
    {
      title: 'Không Gian Thư Giãn',
      description: 'Tận hưởng không gian ấm cúng và yên tĩnh cùng những người thân yêu',
      buttonText: 'Tìm Hiểu Thêm',
      link: '#about',
      image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      title: 'Ưu Đãi Đặc Biệt',
      description: 'Khám phá những ưu đãi hấp dẫn dành riêng cho thành viên',
      buttonText: 'Xem Ngay',
      link: '#',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Lỗi khi lấy sản phẩm:', error));

    axios.get('/api/auth/check', { withCredentials: true })
      .then(response => setIsAuthenticated(response.data.isAuthenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const addToCart = async (productId, price, name) => {
    if (!isAuthenticated) {
      if (window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?")) {
        navigate('/signin');
      }
      return;
    }

    try {
      const response = await axios.post('/api/cart/add', { productId, price, name }, { withCredentials: true });
      alert(response.data.message || 'Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      {/* Navbar */}
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

      {/* Banner Section */}
      <div className="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="banner-overlay">
                <div className="banner-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                  <a href={slide.link} className="banner-btn">{slide.buttonText}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section className="products-section" id="menu">
        <h2 className="section-title">Menu của chúng tôi</h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <div className="product-card" key={product._id}>
                <img className="product-image" src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product._id, product.price, product.name)}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào được tìm thấy.</p>
          )}
        </div>
      </section>

      {/* Footer */}
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
              <a href="https://www.facebook.com"><i className="fab fa-facebook"></i></a>
              <a href="https://www.instagram.com"><i className="fab fa-instagram"></i></a>
              <a href="https://www.twitter.com"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2024 Coffee House. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
