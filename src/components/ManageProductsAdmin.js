import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
`;

const Button = styled.button`
  background-color: ${(props) => (props.delete ? '#ff4d4d' : '#007bff')};
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  transition: background 0.3s;

  &:hover {
    background-color: ${(props) => (props.delete ? '#cc0000' : '#0056b3')};
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: auto;
`;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const ProductItem = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  width: 48%;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 5px;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
`;

const ManageProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });
   const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm');

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        window.alert('Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('image', newProduct.image);

    try {
      const response = await fetch('http://localhost:8080/admin/products', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Lỗi khi thêm sản phẩm mới');

      const data = await response.json();
      window.alert('Sản phẩm đã được thêm thành công!');

      setNewProduct({ name: '', price: '', description: '', image: null });
      setProducts((prev) => [data.product, ...prev]); 
    } catch (error) {
      window.alert('Không thể thêm sản phẩm mới.');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/products/delete/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Không thể xóa sản phẩm');

      const data = await response.json();
      window.alert(data.message);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      window.alert('Có lỗi khi xóa sản phẩm!');
    }
  };

const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        navigate('/');
        alert('Đăng xuất thành công!');
      }
    } catch (error) {
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <AdminContainer>
      <Header>
        <h1>Quản lý sản phẩm</h1>
        <Button onClick={handleLogout}>Đăng xuất</Button>
          <Button href="/admin/manage-products" primary>Quản lý sản phẩm</Button>
          <Button href="/admin/orders">Quản lý đơn hàng</Button>
      </Header>

      <Container>
        <FormContainer>
          <h2>Thêm sản phẩm mới</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Tên sản phẩm</label>
              <input type="text" name="name" value={newProduct.name} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Giá sản phẩm</label>
              <input type="number" name="price" value={newProduct.price} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Mô tả sản phẩm</label>
              <textarea name="description" value={newProduct.description} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <label>Hình ảnh sản phẩm</label>
              <input type="file" name="image" onChange={handleImageChange} accept="image/*" required />
            </FormGroup>
            <Button type="submit">Thêm sản phẩm</Button>
          </form>
        </FormContainer>

        <h2>Danh sách sản phẩm</h2>
        {loading ? (
          <LoadingText>Đang tải sản phẩm...</LoadingText>
        ) : (
          <ProductList>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductItem key={product._id}>
                  {product.image ? (
                    <ProductImage src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
                  ) : (
                    <p>Không có hình ảnh</p>
                  )}
                  <h3>{product.name}</h3>
                  <p>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                  <p>{product.description}</p>
                  <Button delete onClick={() => handleDelete(product._id)}>Xóa</Button>
                </ProductItem>
              ))
            ) : (
              <p>Không có sản phẩm nào.</p>
            )}
          </ProductList>
        )}
      </Container>
    </AdminContainer>
  );
};

export default ManageProductsAdmin;
