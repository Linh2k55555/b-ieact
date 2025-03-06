import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng
import axios from 'axios';
import '../css/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kiểm tra đăng nhập
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Lỗi khi lấy sản phẩm:', error));

    // Kiểm tra trạng thái đăng nhập
    axios.get('/api/auth/check', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch(error => {
        console.error('Lỗi kiểm tra đăng nhập:', error);
        setIsAuthenticated(false);
      });
  }, []);

  // Xử lý thêm vào giỏ hàng
  const addToCart = async (productId, price, name) => {
    if (!isAuthenticated) {
      if (window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?")) {
        navigate('/signin'); // Điều hướng đến trang đăng nhập
      }
      return;
    }

    try {
      const response = await axios.post('/api/cart/add', { productId, price, name }, { withCredentials: true });
      alert(response.data.message || 'Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <section className="products-section" id="menu">
      <h2 className="section-title">Menu của chúng tôi</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div className="product-card" key={product._id}>
              <img className="product-image" src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </div>
                <button className="add-to-cart-btn" onClick={() => addToCart(product._id, product.price, product.name)}>
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào được tìm thấy.</p>
        )}
      </div>
    </section>
  );
};

export default Products;
