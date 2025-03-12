import React, { useEffect, useState } from "react";

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
        console.error("Lỗi khi lấy lịch sử:", err);
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
    <div className="container">
      <h1>Lịch sử giao dịch</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Tổng tiền</th>
              <th>Địa chỉ</th>
              <th>Phương thức thanh toán</th>
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
                  <span
                    className={`status-badge status-${transaction.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td>
                  {["Đang giao", "Đã giao", "Đã hủy"].includes(transaction.status) ? (
                    <span style={{ color: "#95a5a6" }}>Không thể hủy</span>
                  ) : (
                    <button onClick={() => cancelOrder(transaction._id)} className="cancel-btn">
                      Hủy đơn
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-message">Không có lịch sử giao dịch nào.</p>
      )}

      <a href="/home2" className="back-btn">
        Trở về trang chủ
      </a>
    </div>
  );
};

export default TransactionHistory;
