import React from 'react';

const Hero = () => {
  return (
    <div className="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="carousel-content">
            <h2>Khám Phá Hương Vị Cà Phê</h2>
            <p>Trải nghiệm những tách cà phê thượng hạng từ khắp nơi trên thế giới</p>
            <a href="#menu" className="carousel-btn">Xem Menu</a>
          </div>
        </div>
        <div className="carousel-item">
          <div className="carousel-content">
            <h2>Không Gian Thư Giãn</h2>
            <p>Tận hưởng không gian ấm cúng và yên tĩnh cùng những người thân yêu</p>
            <a href="#about" className="carousel-btn">Tìm Hiểu Thêm</a>
          </div>
        </div>
        <div className="carousel-item">
          <div className="carousel-content">
            <h2>Ưu Đãi Đặc Biệt</h2>
            <p>Khám phá những ưu đãi hấp dẫn dành riêng cho thành viên</p>
            <a href="/signup" className="carousel-btn">Đăng Ký Ngay</a>
          </div>
        </div>
      </div>
      <button className="carousel-control prev">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-control next">
        <i className="fas fa-chevron-right"></i>
      </button>
      <div className="carousel-indicators">
        <span className="indicator active"></span>
        <span className="indicator"></span>
        <span className="indicator"></span>
      </div>
    </div>
  );
};

export default Hero;