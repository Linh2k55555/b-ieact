import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]); // Đảm bảo là một mảng
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', { withCredentials: true });
      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products); // Đảm bảo products là mảng
      } else {
        setMessage('Dữ liệu không hợp lệ!');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Không thể tải danh sách sản phẩm.');
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post('http://localhost:8080/api/products', formData, { withCredentials: true });
      setMessage(response.data.message);
      fetchProducts();  // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Lỗi khi thêm sản phẩm.');
    }
  };

  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post(`http://localhost:8080/api/products/${productId}`, formData, { withCredentials: true });
      setMessage(response.data.message);
      setEditProduct(null); // Đóng form chỉnh sửa
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Lỗi khi cập nhật sản phẩm.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/delete/${productId}`, { withCredentials: true });
      setMessage(response.data.message);
      fetchProducts();  // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Lỗi khi xóa sản phẩm.');
    }
  };

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>
      {message && <div className="message">{message}</div>}
      
      {/* Form thêm sản phẩm */}
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

      {/* Danh sách sản phẩm */}
      <h2>Danh sách sản phẩm</h2>
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.image ? (
                      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className="product-image" />
                    ) : (
                      <span>Không có hình ảnh</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString('vi-VN')} VND</td>
                  <td>{product.description}</td>
                  <td>
                    <button onClick={() => setEditProduct(product)} className="btn-edit">Sửa</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="btn-delete">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">Không có sản phẩm nào được tìm thấy.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* Form chỉnh sửa sản phẩm */}
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
