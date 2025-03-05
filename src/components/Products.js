import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sử dụng fetch để lấy sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Gửi cookies cùng với yêu cầu
      });
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data.products)) {
        setProducts(data.products);
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
  
  // Hàm thêm sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://localhost:8080/admin/products', {
        method: 'POST',
        body: formData,
        credentials: 'include',  // Đảm bảo gửi cookie cùng với yêu cầu
      });

      const result = await response.json();
      setMessage(result.message);
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Lỗi khi thêm sản phẩm.");
    }
  };

  // Hàm cập nhật sản phẩm
  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch(`http://localhost:8080/admin/products/${productId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',  // Đảm bảo gửi cookie cùng với yêu cầu
      });

      const result = await response.json();
      setMessage(result.message);
      setEditProduct(null);
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Lỗi khi cập nhật sản phẩm.");
    }
  };

  // Hàm xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/products/delete/${productId}`, {
        method: 'GET',
        credentials: 'include',  // Đảm bảo gửi cookie cùng với yêu cầu
      });

      const result = await response.json();
      setMessage(result.message);
      fetchProducts(); // Tải lại danh sách sản phẩm
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
