import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// 🎨 Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f4f4f4;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background: #3498db;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Select = styled.select`
  padding: 5px;
  border-radius: 5px;
`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin/orders", { withCredentials: true });

        if (response.data.orders && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setMessage("Không có đơn hàng nào.");
        }
      } catch (error) {
        setMessage("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/transactions/admin/update-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      alert(response.data.message || "Cập nhật trạng thái thành công!");

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      alert("Đã xảy ra lỗi khi cập nhật trạng thái!");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        navigate('/');
        alert("Đăng xuất thành công!");
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert("Có lỗi xảy ra trong khi đăng xuất!");
    }
  };


  return (
    <Container>
      <Header>
        <Title>Quản lý đơn hàng</Title>
        <Button onClick={handleLogout}>Đăng xuất</Button>
          <Button href="/admin/manage-products" primary>Quản lý sản phẩm</Button>
          <Button href="/admin/orders">Quản lý đơn hàng</Button>
      </Header>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Ngày đặt hàng</Th>
              <Th>Email Khách Hàng</Th>
              <Th>Tổng tiền</Th>
              <Th>Trạng thái</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <Td>{new Date(order.createdAt).toLocaleString("vi-VN")}</Td>
                <Td>{order.userId?.email || "N/A"}</Td>
                <Td>{order.total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Td>
                <Td>
                  <Select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã huỷ">Đã huỷ</option>
                    <option value="Đã giao">Đã giao</option>
                  </Select>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrders;
