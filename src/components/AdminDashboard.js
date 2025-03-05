import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Hook dùng để chuyển hướng người dùng

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products', { withCredentials: true });
        
        // Kiểm tra nếu dữ liệu trả về không phải là mảng hợp lệ
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setMessage('Không có sản phẩm nào được tìm thấy.');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setMessage("Không thể tải danh sách sản phẩm.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout', { withCredentials: true });
      if (response.status === 200) {
        navigate('/');  // Chuyển hướng về trang đăng nhập
        alert("Đăng xuất thành công!");
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert("Có lỗi xảy ra trong khi đăng xuất!");
    }
  };

  return (
    <div>
      <header style={{ backgroundColor: 'rgba(44, 19, 6, 0.9)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#e6b17e', fontFamily: 'Playfair Display', fontSize: '2.2rem' }}>Quản lý sản phẩm</h1>
        <div className="action-buttons">
          <button onClick={handleLogout} style={buttonStyles}>Đăng xuất</button>
          <button style={buttonStyles}>Quản lý sản phẩm</button>
          <button style={buttonStyles}>Quản lý đơn hàng</button>
        </div>
      </header>

      <div className="container" style={{ marginTop: '30px' }}>
        {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}
        <h2 style={{ color: '#e6b17e' }}>Danh sách sản phẩm</h2>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product" style={productStyles}>
              {product.image ? (
                <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} style={imageStyles} />
              ) : (
                <p>Không có hình ảnh.</p>
              )}
              <div className="product-details" style={{ marginLeft: '25px' }}>
                <h3 style={{ color: '#e6b17e', fontSize: '1.6rem' }}>{product.name}</h3>
                <p>Giá: {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p>Mô tả: {product.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào được tìm thấy.</p>
        )}
      </div>
    </div>
  );
};

const buttonStyles = {
  padding: '10px 20px',
  backgroundColor: '#c17f59',
  color: '#fff',
  borderRadius: '25px',
  marginLeft: '10px',
  cursor: 'pointer',
};

const productStyles = {
  display: 'flex',
  marginBottom: '25px',
  padding: '20px',
  background: 'rgba(59, 28, 12, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
  transition: 'all 0.3s ease',
};

const imageStyles = {
  width: '180px',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
};

export default AdminDashboard;
