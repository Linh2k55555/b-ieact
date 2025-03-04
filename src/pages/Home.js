import React from 'react';
import Navbar from '../components/Navbar';

import Products from '../components/Products';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';
import MessageAlert from '../components/MessageAlert';
import Carousel from '../components/Carousel';

const Home1 = () => {
    const message = "Chào mừng bạn đến với Coffee House!"; 
  return (
    <div>
      <Navbar />
      <MessageAlert message={message} />
      <Carousel />
      <Products />
      <CartSidebar />
      <Footer />
    </div>
  );
};

export default Home1;