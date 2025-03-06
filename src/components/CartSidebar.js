import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CartSidebar.css';

const CartSidebar = ({ onClose }) => {
  const [cart, setCart] = useState({ items: [] });

  // ✅ Hàm lấy giỏ hàng từ API backend
  const loadCart = async () => {
    try {
      const response = await axios.get('/api/cart', { withCredentials: true }); // Gửi cookie xác thực
      setCart(response.data);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  };

  
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`, { withCredentials: true });
  
      if (response.status === 200) {
        alert(response.data.message || "Đã xóa sản phẩm khỏi giỏ hàng!");
        loadCart(); // ✅ Tải lại giỏ hàng sau khi xóa
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
    }
  };
  
  // ✅ Hàm chuyển hướng đến trang thanh toán
  const checkoutCart = () => {
    window.location.href = "/checkout";
  };

  // ✅ Gọi API lấy giỏ hàng khi component được mount
  useEffect(() => {
    loadCart();
  }, []);

  // ✅ Kiểm tra giỏ hàng có sản phẩm không
  const hasItems = Array.isArray(cart.items) && cart.items.length > 0;

  return (
    <div className="cart-sidebar open">
      <div className="cart-header">
        <h3>Giỏ hàng</h3>
        <button className="close-cart" onClick={onClose}>❌ Đóng</button>
      </div>
      <ul id="cart-items">
  {hasItems ? (
    cart.items.map((item) => (
      <li key={item.productId?._id || item.productId}> {/* ✅ Sử dụng ID để đảm bảo key duy nhất */}
        {item.name} - {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} x {item.quantity}
        <button className="remove-btn" onClick={() => removeFromCart(item.productId?._id || item.productId)}>Xóa</button>
      </li>
    ))
  ) : (
    <li>Chưa có sản phẩm nào trong giỏ hàng.</li>
  )}
</ul>

      <div id="cart-total">
        Tổng: {hasItems ? cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "0 VND"}
      </div>
      <button id="checkout-btn" onClick={checkoutCart}>Thanh toán</button>
    </div>
  );
};

export default CartSidebar;
