import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState([]);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/api/signup', {
        username,
        email,
        password,
        confirmPassword,
        age,
      });

      window.alert("Đăng ký thành công! Đang chuyển hướng...");

      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message || "Đã có lỗi xảy ra.");
        setErrors([error.response.data.message]);
      } else {
        window.alert("Không thể kết nối với server.");
        setErrors([]);
      }
    }
  };

  return (
    <div className="container">
      <h1>Đăng ký</h1>

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
          <i className="fas fa-user"></i>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nhập tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            id="email"
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
            id="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-calendar"></i>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Nhập tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <button type="submit">Đăng ký</button>
      </form>

      <div className="extra-links">
        <p>Bạn đã có tài khoản? <a href="/signin">Đăng nhập</a></p>
      </div>
    </div>
  );
};

export default Signup;
