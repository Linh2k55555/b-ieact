import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import '../css/Home.css';

const Home1 = () => {
  useEffect(() => {
    const hasShownMessage = localStorage.getItem('hasShownWelcomeMessage');

    if (!hasShownMessage) {
      window.alert("Chào mừng bạn đến với Coffee House! Khám phá những sản phẩm cà phê tuyệt vời.");
      
      localStorage.setItem('hasShownWelcomeMessage', 'true');
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Carousel />
      <Products />
      <Footer />
    </div>
  );
};

export default Home1;
