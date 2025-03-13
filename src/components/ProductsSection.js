import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Section = styled.section`
  padding: 50px 20px;
  text-align: center;
  background: #f7f7f7;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-weight: bold;
  color: #333;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ProductInfo = styled.div`
  text-align: center;
`;

const ProductName = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff5733;
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button`
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: linear-gradient(45deg, #ff4b2b, #ff416c);
    transform: scale(1.05);
  }
`;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/check", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("❌ Lỗi kiểm tra đăng nhập:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

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
    <Section id="menu">
      <Title>Menu của chúng tôi</Title>
      <ProductsGrid>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id}>
              <ProductImage
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </ProductPrice>
                <AddToCartButton
                  onClick={() => addToCart(product._id, product.price, product.name)}
                >
                  Thêm vào giỏ hàng
                </AddToCartButton>
              </ProductInfo>
            </ProductCard>
          ))
        ) : (
          <p>Không có sản phẩm nào được tìm thấy.</p>
        )}
      </ProductsGrid>
    </Section>
  );
};

export default ProductsSection;
