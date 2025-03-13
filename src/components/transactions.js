import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: ${({ status }) => 
    status === "Đang giao" ? "#f39c12" :
    status === "Đã giao" ? "#2ecc71" :
    status === "Đã hủy" ? "#e74c3c" :
    "#3498db"};
`;

const CancelButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #555;
`;

const BackButton = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background: #2980b9;
  }
`;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/transactions/history")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải lịch sử giao dịch");
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const cancelOrder = async (transactionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      const res = await fetch(`/transactions/cancel/${transactionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi hủy đơn!");

      alert(data.message);
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === transactionId ? { ...tx, status: "Đã hủy" } : tx
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container>
      <Title>Lịch sử giao dịch</Title>

      {loading ? (
        <Message>Đang tải dữ liệu...</Message>
      ) : error ? (
        <Message style={{ color: "red" }}>{error}</Message>
      ) : transactions.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Tổng tiền</th>
              <th>Địa chỉ</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.createdAt).toLocaleString("vi-VN")}</td>
                <td>
                  <strong>
                    {transaction.total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </strong>
                </td>
                <td>
                  {transaction.address}, {transaction.ward}, {transaction.district}, {transaction.city}
                </td>
                <td>
                  {transaction.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Chuyển khoản"}
                </td>
                <td>
                  <StatusBadge status={transaction.status}>{transaction.status}</StatusBadge>
                </td>
                <td>
                  {["Đang giao", "Đã giao", "Đã hủy"].includes(transaction.status) ? (
                    <CancelButton disabled>Không thể hủy</CancelButton>
                  ) : (
                    <CancelButton onClick={() => cancelOrder(transaction._id)}>Hủy đơn</CancelButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Message>Không có lịch sử giao dịch nào.</Message>
      )}

      <BackButton href="/home2">Trở về trang chủ</BackButton>
    </Container>
  );
};

export default TransactionHistory;
