import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setMessage('Không có đơn hàng nào được tìm thấy.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setMessage('Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
      if (response.status === 200) {
        alert('Đăng xuất thành công!');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <div className="admin-orders-container">
      <header>
        <h1>Quản lý đơn hàng</h1>
        <div className="action-buttons">
          <a href="/logout" onClick={handleLogout}>Đăng xuất</a>
          <a href="/admin/manage-products" className="btn-manage-products">Quản lý sản phẩm</a>
          <a href="/admin/orders" className="btn-manage-orders">Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container">
        {message && (
          <p className="message">{message}</p>
        )}

        <h2>Danh sách đơn hàng</h2>

        {loading ? (
          <p className="loading">Đang tải đơn hàng...</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-details">
                  <h3>{order.userId.email}</h3>
                  <p>
                    Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                  </p>
                  <p>Trạng thái: {order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
