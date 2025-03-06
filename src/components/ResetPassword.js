import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`http://localhost:8080/reset-password/${token}`);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      window.alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      window.alert("Mật khẩu đã được cập nhật! Chuyển hướng về trang đăng nhập...");
      
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      window.alert("Lỗi khi đặt lại mật khẩu, vui lòng thử lại.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="container">
        <h1>Đặt lại mật khẩu</h1>

        {validToken === null ? (
          <p>Đang kiểm tra liên kết...</p>
        ) : validToken ? (
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
