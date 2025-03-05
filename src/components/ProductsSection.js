import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);

  // Fetch products when the component is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          withCredentials: true,  // Add this to send cookies along with the request
        });
        setProducts(response.data);  // Update the state with fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    

    fetchProducts();
  }, []); // Empty dependency array, so it runs only once when the component mounts

  // Add product to the cart
  const addToCart = async (productId, price, name) => {
    try {
      const response = await axios.post('http://localhost:8080/api/cart/add', { productId, price, name }); // Adjusted to the correct URL
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
              {/* Assuming product.image is a base64 image string */}
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
