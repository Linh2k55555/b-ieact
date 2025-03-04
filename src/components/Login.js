import React, { useState } from 'react';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');  // Reset message before sending the request

    try {
      const response = await axios.post('http://localhost:8080/api/signin', { email, password });

      // Kiểm tra xem có trả về thông báo thành công không
      if (response.data.message) {
        setMessage(response.data.message);
        if (response.data.redirectUrl) {
          // Chuyển hướng nếu có URL trả về từ backend
          window.location.href = response.data.redirectUrl;
        }
      } else {
        setMessage('Đăng nhập thất bại');
      }
    } catch (error) {
      if (error.response) {
        // Nếu có phản hồi từ server
        setMessage(error.response.data.message || 'Lỗi khi kết nối đến server');
      } else if (error.request) {
        // Nếu không có phản hồi, nhưng đã gửi yêu cầu
        setMessage('Không thể kết nối đến máy chủ');
      } else {
        // Lỗi khác trong quá trình xử lý yêu cầu
        setMessage('Lỗi khi gửi yêu cầu');
      }
    } finally {
      setLoading(false);  // Tắt loading khi hoàn tất
    }
  };

  return (
    <div className="container">
      <h1>Đăng nhập</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="extra-links">
        <p><a href="/forgot-password">Quên mật khẩu?</a></p>
        <p>Bạn chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
      </div>
    </div>
  );
};

export default Login;
