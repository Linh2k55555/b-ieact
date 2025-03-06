import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Thêm axios để dễ gọi API
import '../css/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch danh sách đơn hàng từ backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/orders', { withCredentials: true });

        console.log("📦 Dữ liệu đơn hàng:", response.data);

        if (response.data.orders && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setMessage('Không có đơn hàng nào.');
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải danh sách đơn hàng:', error);
        setMessage('Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/transactions/admin/update-status/${orderId}`, 
        { status: newStatus }, 
        { withCredentials: true }
      );

      alert(response.data.message || "Cập nhật trạng thái thành công!");
      
      // Cập nhật trạng thái mới vào danh sách đơn hàng
      setOrders(prevOrders =>
        prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
      );

    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái!");
    }
  };

  // ✅ Hàm đăng xuất admin
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/logout', { withCredentials: true });
      alert('Đăng xuất thành công!');
      navigate('/signin');
    } catch (error) {
      console.error('❌ Lỗi khi đăng xuất:', error);
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <div className="admin-orders-container">
      <header>
        <h1>Quản lý đơn hàng</h1>
        <div className="action-buttons">
          <button onClick={handleLogout}>Đăng xuất</button>
          <a href="/admin/manage-products" className="btn-manage-products">Quản lý sản phẩm</a>
          <a href="/admin/orders" className="btn-manage-orders">Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container">
        {message && <p className="message">{message}</p>}

        <h2>Danh sách đơn hàng</h2>

        {loading ? (
          <p className="loading">Đang tải đơn hàng...</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Ngày đặt hàng</th>
                <th>Email Khách Hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                  <td>{order.userId?.email || "N/A"}</td>
                  <td>{order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Đã huỷ">Đã huỷ</option>
                      <option value="Đã giao">Đã giao</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
