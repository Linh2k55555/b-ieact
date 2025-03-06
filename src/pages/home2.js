import React, { useEffect } from 'react';
import Navbar2 from '../components/Navbar2';
import Carousel from '../components/Carousel';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';

const Home2 = () => {
  useEffect(() => {
    const message = localStorage.getItem('loginMessage');
    if (message) {
      window.alert(message); 
      localStorage.removeItem('loginMessage'); 
    }
  }, []);

  return (
    <div className="Home2-page">
      <Navbar2 />
      <Carousel />
      <ProductsSection />
      <Footer />
    </div>
  );
};

export default Home2;
