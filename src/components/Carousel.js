import React, { useState, useEffect } from 'react';
import '../css/Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.title} className="carousel-image" />
            <div className="carousel-overlay">
              <div className="carousel-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <a href={slide.link} className="carousel-btn">{slide.buttonText}</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>
        ❮
      </button>
      <button className="carousel-control next" onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>
        ❯
      </button>
    </div>
  );
};

export default Carousel;