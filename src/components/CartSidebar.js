import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// 🎨 Styled Components
const CartContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  padding: 15px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const CartItemsList = styled.ul`
  list-style: none;
  padding: 0;
  flex-grow: 1;
  overflow-y: auto;
`;

const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const RemoveButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  &:hover {
    background: darkred;
  }
`;

const CartTotal = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0;
  text-align: center;
`;

const CheckoutButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: #27ae60;
  }
`;

const CartSidebar = ({ onClose }) => {
  const [cart, setCart] = useState({ items: [] });

  const loadCart = async () => {
    try {
      const response = await axios.get("/api/cart", { withCredentials: true });
      setCart(response.data);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert(response.data.message || "Đã xóa sản phẩm khỏi giỏ hàng!");
        loadCart();
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  const checkoutCart = () => {
    window.location.href = "/checkout";
  };

  useEffect(() => {
    loadCart();
  }, []);

  const hasItems = Array.isArray(cart.items) && cart.items.length > 0;

  return (
    <CartContainer>
      <CartHeader>
        <h3>Giỏ hàng</h3>
        <CloseButton onClick={onClose}>❌</CloseButton>
      </CartHeader>

      <CartItemsList>
        {hasItems ? (
          cart.items.map((item) => (
            <CartItem key={item.productId?._id || item.productId}>
              <span>
                {item.productId?.name || item.name || "Sản phẩm không có tên"} -{" "}
                {item.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                x {item.quantity}
              </span>
              <RemoveButton
                onClick={() =>
                  removeFromCart(item.productId?._id || item.productId)
                }
              >
                Xóa
              </RemoveButton>
            </CartItem>
          ))
        ) : (
          <li>Chưa có sản phẩm nào trong giỏ hàng.</li>
        )}
      </CartItemsList>

      <CartTotal>
        Tổng:{" "}
        {hasItems
          ? cart.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          : "0 VND"}
      </CartTotal>

      <CheckoutButton onClick={checkoutCart}>Thanh toán</CheckoutButton>
    </CartContainer>
  );
};

export default CartSidebar;
