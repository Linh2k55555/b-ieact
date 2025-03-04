// src/components/ProductsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId, price, name) => {
    try {
      const response = await axios.post('/api/cart/add', { productId, price, name });
      alert(response.data.message || "Thêm vào giỏ hàng thành công!");
    } catch (error) {
      alert("Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  return (
    <section className="products-section" id="menu">
      <h2 className="section-title">Menu của chúng tôi</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img className="product-image" src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product._id, product.price, product.name)}
                >
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

export default ProductsSection;
