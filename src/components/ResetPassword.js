import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [validToken, setValidToken] = useState(false);

  // ✅ Kiểm tra token trước khi hiển thị form
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/reset-password/${token}`);
        setValidToken(response.data.valid);
      } catch (error) {
        setMessage("Token không hợp lệ hoặc đã hết hạn!");
      }
    };
    verifyToken();
  }, [token]);

  // ✅ Xử lý cập nhật mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      alert(response.data.message || "Mật khẩu đã cập nhật!");
      navigate("/signin");
    } catch (error) {
      setMessage("Lỗi khi đặt lại mật khẩu, vui lòng thử lại.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="container">
        <h1>Đặt lại mật khẩu</h1>
        
        {message && <div className="message">{message}</div>}

        {validToken ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Đặt lại mật khẩu</button>
          </form>
        ) : (
          <p>Liên kết đã hết hạn hoặc không hợp lệ.</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
