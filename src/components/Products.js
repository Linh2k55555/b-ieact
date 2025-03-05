import React, { useEffect, useState } from 'react';
import '../css/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (productId, price, name) => {
    // Add to cart logic here
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