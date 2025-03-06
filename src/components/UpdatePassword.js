import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    try {
      await axios.post(
        'http://localhost:8080/api/update-password',
        formData,
        { withCredentials: true }
      );

      window.alert("Cập nhật mật khẩu thành công!");

      setTimeout(() => {
        navigate('/home2');
      }, 2000);
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message || "Lỗi khi cập nhật mật khẩu.");
      } else {
        window.alert("Không thể kết nối đến máy chủ.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Cập nhật mật khẩu</h1>

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
