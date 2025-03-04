// src/pages/home2.js
import React from 'react';
import Navbar2 from '../components/Navbar2';
import MessageAlert from '../components/MessageAlert';
import Carousel from '../components/Carousel';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';

const Home2 = () => {
  const message = "Chào mừng bạn đến với Coffee House!"; // Hoặc lấy từ API nếu có

  return (
    <div className="Home2-page">
      <Navbar2 />
      <MessageAlert message={message} />
      <Carousel />
      <ProductsSection />
      <Footer />
    </div>
  );
};

export default Home2;
