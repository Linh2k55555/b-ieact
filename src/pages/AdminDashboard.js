import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #3498db;
  padding: 15px;
  color: white;
  border-radius: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.a`
  background: ${(props) => (props.primary ? "#2ecc71" : "#e74c3c")};
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  transition: 0.3s;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductItem = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => (props.error ? "red" : "black")};
  font-size: 1.2rem;
  margin-top: 20px;
`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setMessage("Không có sản phẩm nào được tìm thấy.");
        }
      } catch (error) {
        setMessage("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", { method: "GET", credentials: "include" });
      if (response.status === 200) {
        alert("Đăng xuất thành công!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra trong khi đăng xuất!");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Quản lý sản phẩm</Title>
        <ActionButtons>
          <Button href="/logout" onClick={handleLogout}>Đăng xuất</Button>
          <Button href="/admin/manage-products" primary>Quản lý sản phẩm</Button>
          <Button href="/admin/orders">Quản lý đơn hàng</Button>
        </ActionButtons>
      </Header>

      {message && <Message error>{message}</Message>}

      <h2>Danh sách sản phẩm</h2>

      {loading ? (
        <Message>Đang tải sản phẩm...</Message>
      ) : (
        <ProductList>
          {products.map((product) => (
            <ProductItem key={product._id}>
              {product.image ? (
                <ProductImage
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                />
              ) : (
                <Message>Không có hình ảnh</Message>
              )}
              <h3>{product.name}</h3>
              <p>
                Giá:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
              <p>Mô tả: {product.description}</p>
            </ProductItem>
          ))}
        </ProductList>
      )}
    </Container>
  );
};

export default AdminProducts;
