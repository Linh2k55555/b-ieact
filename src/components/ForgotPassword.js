import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css"; // Đảm bảo có file CSS cho trang này

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Xử lý gửi yêu cầu đặt lại mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/forgot-password", { email });

      setMessage(response.data.message || "Liên kết đặt lại mật khẩu đã được gửi!");
      
      // Sau khi gửi thành công, chuyển hướng về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate("/signin");
      }, 3000);

    } catch (error) {
      setMessage("❌ Lỗi! Không thể gửi yêu cầu. Hãy thử lại.");
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);
    }

    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="container">
        <h1>Quên mật khẩu</h1>
        <p className="description">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>

        <div className="extra-links">
          <p><a href="/signin">Quay lại đăng nhập</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
