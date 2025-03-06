import React, { useEffect, useState } from "react";
import axios from "axios";

// Định nghĩa axios instance một lần
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Quan trọng! Để gửi session cookie
});

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/check", {
          withCredentials: true, // 🔥 Quan trọng! Đảm bảo session được gửi
        });
        console.log("🔍 Trạng thái đăng nhập:", response.data);
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("❌ Lỗi kiểm tra đăng nhập:", error);
        setIsAuthenticated(false);
      }
    };
  
    checkAuth();
  }, []);
  
  // ✅ Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Thêm vào giỏ hàng
  const addToCart = async (productId, price, name) => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/cart/add", { productId, price, name });
      alert(response.data.message || "Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
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
              <img
                className="product-image"
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
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
