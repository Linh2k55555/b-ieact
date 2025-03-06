import React, { useState, useEffect } from 'react';
import '../css/ManageProducts.css';

const ManageProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
      if (response.status === 200) {
        window.alert('Đăng xuất thành công!');
        window.location.href = '/signin';
      }
    } catch (error) {
      window.alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

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

  return (
    <div className="admin-products-container">
      <header>
        <h1>Quản lý sản phẩm</h1>
        <div className="action-buttons">
          <button onClick={handleLogout}>Đăng xuất</button>
          <a href="/admin/manage-products" className="btn-manage-products">Quản lý sản phẩm</a>
          <a href="/admin/orders" className="btn-manage-orders">Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container">
        <div className="form-container">
          <h2>Thêm sản phẩm mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input type="text" name="name" value={newProduct.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Giá sản phẩm</label>
              <input type="number" name="price" value={newProduct.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea name="description" value={newProduct.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Hình ảnh sản phẩm</label>
              <input type="file" name="image" onChange={handleImageChange} accept="image/*" required />
            </div>
            <button type="submit">Thêm sản phẩm</button>
          </form>
        </div>

        <h2>Danh sách sản phẩm</h2>
        {loading ? (
          <p className="loading">Đang tải sản phẩm...</p>
        ) : (
          <div className="product-list">
            {products.length > 0 ? (
              products.map((product) => (
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

                  <div className="action-buttons">
                    <button onClick={() => handleDelete(product._id)} className="btn-delete">
                      <i className="fas fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsAdmin;
