import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import the Link component from react-router-dom

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data using 'fetch'
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',  // Ensure cookies are sent with the request (if needed)
        });

        const data = await response.json();  // Parse the response to JSON
        console.log(data);  // For debugging

        if (Array.isArray(data.products)) {
          setProducts(data.products);  // Set the products data to state
        } else {
          setMessage('Không có sản phẩm nào được tìm thấy.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);  // Ensure loading is set to false after fetching data
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
      if (response.status === 200) {
        alert('Đăng xuất thành công!');
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <div>
      <header style={{ backgroundColor: 'rgba(44, 19, 6, 0.9)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#e6b17e', fontFamily: 'Playfair Display', fontSize: '2.2rem' }}>Quản lý sản phẩm</h1>
        <div className="action-buttons">
          <button onClick={handleLogout} style={buttonStyles}>Đăng xuất</button>
          <Link to="/admin/manage-products" style={buttonStyles}>Quản lý sản phẩm</Link>
          <Link to="/admin/order" style={buttonStyles}>Quản lý đơn hàng</Link>
        </div>
      </header>

      <div className="container" style={{ marginTop: '30px' }}>
        {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}
        <h2 style={{ color: '#e6b17e' }}>Danh sách sản phẩm</h2>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product" style={productStyles}>
              {product.image ? (
                <img 
                  src={`http://localhost:8080${product.image}`} 
                  alt={product.name} 
                  style={imageStyles} 
                />
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
        ))}
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
  textDecoration: 'none',  // Ensure the Link component doesn't have default underline
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
