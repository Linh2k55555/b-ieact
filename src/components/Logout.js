import React, { useState } from 'react';
import axios from 'axios'; // Đảm bảo axios được import

const Logout = () => {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/logout');
      setMessage(response.data.message);  // Hiển thị thông báo đăng xuất thành công

      // Sau 2 giây, chuyển hướng về trang đăng nhập
      setTimeout(() => {
        window.location.href = '/signin'; // Điều hướng đến trang đăng nhập
      }, 2000); // Chờ 2 giây để người dùng đọc thông báo trước khi chuyển hướng
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <div className="logout-container">
      <h2>{message ? message : 'Bạn có chắc chắn muốn đăng xuất?'}</h2>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Logout;
