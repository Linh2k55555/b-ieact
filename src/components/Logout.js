import React from 'react';
import axios from 'axios';

const Logout = () => {
  const handleLogout = async () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (!confirmLogout) return;

    try {
      const response = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });

      window.alert(response.data.message || 'Đăng xuất thành công!');
      window.location.href = '/';
    } catch (error) {
      window.alert('Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <div className="logout-container">
      <h2>Đăng xuất</h2>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Logout;
