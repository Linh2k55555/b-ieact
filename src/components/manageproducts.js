import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', { withCredentials: true });
      console.log(response.data);  // Thêm log để kiểm tra cấu trúc dữ liệu trả về

      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setMessage('Không có sản phẩm nào được tìm thấy.');
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Không thể tải danh sách sản phẩm.");
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post('http://localhost:8080/admin/products', formData, { withCredentials: true });
      setMessage(response.data.message);  // Thông báo từ backend
      fetchProducts();  // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Lỗi khi thêm sản phẩm.");
    }
  };

  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post(`http://localhost:8080/admin/products/${productId}`, formData, { withCredentials: true });
      setMessage(response.data.message);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Lỗi khi cập nhật sản phẩm.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/admin/products/delete/${productId}`, { withCredentials: true });
      setMessage(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Lỗi khi xóa sản phẩm.");
    }
  };

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>
      {message && <div className="message">{message}</div>}

      {/* Form to add new product */}
      <div className="form-container">
        <h2>Thêm sản phẩm mới</h2>
        <form onSubmit={handleAddProduct} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Giá sản phẩm</label>
              <input type="number" name="price" required />
            </div>
            <div className="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea name="description" rows="3"></textarea>
            </div>
            <div className="form-group">
              <label>Hình ảnh sản phẩm</label>
              <input type="file" name="image" accept="image/*" required />
            </div>
          </div>
          <button type="submit">Thêm sản phẩm</button>
        </form>
      </div>

      {/* Display Products */}
      <h2>Danh sách sản phẩm</h2>
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <section className="products-section" id="menu">
          <h2 className="section-title">Danh sách sản phẩm</h2>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  {product.image ? (
                    <img className="product-image" 
                         src={`http://localhost:8080${product.image}`} 
                         alt={product.name} />
                  ) : (
                    <span>Không có hình ảnh</span>
                  )}
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-price">
                      {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                    <button onClick={() => setEditProduct(product)} className="btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="btn-delete">Xóa</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào được tìm thấy.</p>
            )}
          </div>
        </section>
      )}

      {/* Edit Product Form */}
      {editProduct && (
        <div className="edit-form">
          <h3>Sửa sản phẩm: {editProduct.name}</h3>
          <form onSubmit={(e) => handleUpdateProduct(e, editProduct._id)} encType="multipart/form-data">
            <div className="form-grid">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input type="text" name="name" defaultValue={editProduct.name} required />
              </div>
              <div className="form-group">
                <label>Giá sản phẩm</label>
                <input type="number" name="price" defaultValue={editProduct.price} required />
              </div>
              <div className="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea name="description" rows="3" defaultValue={editProduct.description}></textarea>
              </div>
              <div className="form-group">
                <label>Hình ảnh sản phẩm</label>
                <input type="file" name="image" accept="image/*" />
              </div>
            </div>
            <button type="submit">Cập nhật sản phẩm</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
