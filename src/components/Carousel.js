// src/components/Carousel.js
import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { title: 'Khám Phá Hương Vị Cà Phê', description: 'Trải nghiệm những tách cà phê thượng hạng từ khắp nơi trên thế giới', buttonText: 'Xem Menu', link: '#menu' },
    { title: 'Không Gian Thư Giãn', description: 'Tận hưởng không gian ấm cúng và yên tĩnh cùng những người thân yêu', buttonText: 'Tìm Hiểu Thêm', link: '#about' },
    { title: 'Ưu Đãi Đặc Biệt', description: 'Khám phá những ưu đãi hấp dẫn dành riêng cho thành viên', buttonText: 'Xem Ngay', link: '#' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
            <div className="carousel-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <a href={slide.link} className="carousel-btn">{slide.buttonText}</a>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-control next" onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>
        <i className="fas fa-chevron-right"></i>
      </button>
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span key={index} className={`indicator ${index === currentIndex ? 'active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
