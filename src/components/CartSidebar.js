import React, { useEffect, useState } from 'react';

const CartSidebar = () => {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    fetch('/api/cart')
      .then(response => response.json())
      .then(data => setCart(data))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  const removeFromCart = (productId) => {
    // Remove from cart logic here
  };

  const checkoutCart = () => {
    // Checkout logic here
  };

  // Kiểm tra nếu cart.items là mảng và có phần tử
  const hasItems = Array.isArray(cart.items) && cart.items.length > 0;

  return (
    <div className="cart-sidebar" id="cart-sidebar">
      <div className="cart-header">
        <h3>Giỏ hàng</h3>
        <button id="close-cart"><i className="fas fa-times"></i></button>
      </div>
      <ul id="cart-items">
        {hasItems ? (
          cart.items.map(item => (
            <li key={item.productId}>
              {item.name} - {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x {item.quantity}
              <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>Xóa</button>
            </li>
          ))
        ) : (
          <li>Chưa có sản phẩm nào trong giỏ hàng.</li>
        )}
      </ul>
      <div id="cart-total">
        Tổng cộng: {hasItems ? cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}
      </div>
      <button id="checkout-btn" onClick={checkoutCart}>Thanh toán</button>
    </div>
  );
};

export default CartSidebar;
