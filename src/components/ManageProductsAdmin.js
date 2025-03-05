import React, { useState, useEffect } from 'react';
import '../css/ManageProducts.css';

const ManageProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setMessage('Không có sản phẩm nào được tìm thấy.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
      if (response.status === 200) {
        alert('Đăng xuất thành công!');
      }
    } catch (error) {
      console.error('Error during logout', error);
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  // Handle input change for new product form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Handle submit new product
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

      if (!response.ok) {
        throw new Error('Failed to add new product');
      }

      const data = await response.json();
      setMessage('Sản phẩm đã được thêm thành công!');
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: null,
      });
      setProducts((prev) => [data.product, ...prev]); // Add the new product to the list
    } catch (error) {
      console.error('Error adding new product:', error);
      setMessage('Không thể thêm sản phẩm mới.');
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        const response = await fetch(`http://localhost:8080/admin/products/delete/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Remove product from list after deletion
        setProducts((prev) => prev.filter((product) => product._id !== productId));
        setMessage('Sản phẩm đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage('Không thể xóa sản phẩm.');
      }
    }
  };

  // Handle edit product
  const handleEdit = async (productId, updatedProduct) => {
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('price', updatedProduct.price);
    formData.append('description', updatedProduct.description);
    formData.append('image', updatedProduct.image);

    try {
      const response = await fetch(`http://localhost:8080/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to edit product');
      }

      const data = await response.json();
      setMessage('Sản phẩm đã được cập nhật thành công!');
      setProducts((prev) =>
        prev.map((product) => (product._id === productId ? data.product : product))
      );
    } catch (error) {
      console.error('Error editing product:', error);
      setMessage('Không thể sửa sản phẩm.');
    }
  };

  return (
    <div className="admin-products-container">
      <header>
        <h1>Quản lý sản phẩm</h1>
        <div className="action-buttons">
          <a href="/logout" onClick={handleLogout}>Đăng xuất</a>
          <a href="/admin/manage-products" className="btn-manage-products">Quản lý sản phẩm</a>
          <a href="/admin/orders" className="btn-manage-orders">Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container">
        {/* Display message if there is an error or no products */}
        {message && <p className="message">{message}</p>}

        {/* Add new product form */}
        <div className="form-container">
          <h2>Thêm sản phẩm mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Giá sản phẩm</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Hình ảnh sản phẩm</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </div>
            <button type="submit">Thêm sản phẩm</button>
          </form>
        </div>

        <h2>Danh sách sản phẩm</h2>

        {/* Show loading state while fetching data */}
        {loading ? (
          <p className="loading">Đang tải sản phẩm...</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
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
                  <button onClick={() => handleEdit(product._id, product)} className="btn-edit">
                    <i className="fas fa-edit"></i> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn-delete"
                  >
                    <i className="fas fa-trash"></i> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsAdmin;
