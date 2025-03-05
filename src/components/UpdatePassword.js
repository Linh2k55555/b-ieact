import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm hook useNavigate

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]); // Reset errors before submitting

    try {
      const response = await axios.post(
        'http://localhost:8080/api/update-password', // API endpoint của backend
        formData,
        { withCredentials: true } // Đảm bảo session cookie được gửi
      );

      // Hiển thị thông báo thành công từ backend
      setMessage(response.data.message);

      // Sau khi thành công, chuyển hướng về trang chủ (hoặc trang bạn muốn)
      setTimeout(() => {
        navigate('/home2'); // Chuyển hướng về trang chủ sau 2 giây
      }, 2000); // Đợi 2 giây để hiển thị thông báo thành công trước khi chuyển hướng

    } catch (error) {
      if (error.response) {
        // Xử lý lỗi validation từ backend
        setErrors(error.response.data.errors || [error.response.data.message]);
      } else {
        setMessage('Lỗi khi kết nối đến máy chủ');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Cập nhật mật khẩu</h1>

      {/* Hiển thị thông báo thành công */}
      {message && <p className="message">{message}</p>}

      {/* Hiển thị lỗi nếu có */}
      {errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            placeholder="Mật khẩu cũ"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-key"></i>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mật khẩu mới"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-check"></i>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>

      <div className="extra-links">
        <p>
          <a href="/home2">Quay lại trang chủ</a>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
