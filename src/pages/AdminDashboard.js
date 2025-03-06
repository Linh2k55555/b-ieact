import React, { useEffect, useState } from 'react';
import '../css/AdminDashboard.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setMessage('Không có sản phẩm nào được tìm thấy.');
        }
      } catch (error) {
        setMessage('Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
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
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <div className="admin-products-container">
      <header>
        <h1>Quản lý sản phẩm</h1>
        <div className="action-buttons">
          <a href="/logout" onClick={handleLogout}>Đăng xuất</a>
          <a href="/admin/manage-products" className="btn-manage-products">Quản lý sản phẩm</a>
          <a href="/admin/orders" className="btn-manage-orders">Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container">
        {message && <p className="message">{message}</p>}

        <h2>Danh sách sản phẩm</h2>

        {loading ? (
          <p className="loading">Đang tải sản phẩm...</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                {product.image ? (
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <p>Không có hình ảnh</p>
                )}
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>
                    Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                  <p>Mô tả: {product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
