import React, { useState, useEffect } from "react";
import styled from "styled-components";

// 🎨 Styled Components
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
`;

const CarouselInner = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
  height: 100%;
`;

const CarouselItem = styled.div`
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  flex-direction: column;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 36px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Button = styled.a`
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background: #e74c3c;
  border-radius: 5px;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background: #c0392b;
  }
`;

const ControlButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 30px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const PrevButton = styled(ControlButton)`
  left: 10px;
`;

const NextButton = styled(ControlButton)`
  right: 10px;
`;

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      title: "Khám Phá Hương Vị Cà Phê",
      description: "Trải nghiệm những tách cà phê thượng hạng từ khắp nơi trên thế giới",
      buttonText: "Xem Menu",
      link: "#menu",
      image: "https://www.pixelstalk.net/wp-content/uploads/2016/05/Coffee-beans-cup-wallpaper-hd.jpg"
    },
    {
      title: "Không Gian Thư Giãn",
      description: "Tận hưởng không gian ấm cúng và yên tĩnh cùng những người thân yêu",
      buttonText: "Tìm Hiểu Thêm",
      link: "#about",
      image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Ưu Đãi Đặc Biệt",
      description: "Khám phá những ưu đãi hấp dẫn dành riêng cho thành viên",
      buttonText: "Xem Ngay",
      link: "#",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <CarouselContainer>
      <CarouselInner style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <Image src={slide.image} alt={slide.title} />
            <Overlay>
              <Title>{slide.title}</Title>
              <Description>{slide.description}</Description>
              <Button href={slide.link}>{slide.buttonText}</Button>
            </Overlay>
          </CarouselItem>
        ))}
      </CarouselInner>

      <PrevButton onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>❮</PrevButton>
      <NextButton onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>❯</NextButton>
    </CarouselContainer>
  );
};

export default Carousel;
