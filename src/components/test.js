import React, { useEffect, useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  
useEffect(() => {
    // Fetch data using 'fetch'
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensure cookies are sent with the request (if needed)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json(); // Parse the response to JSON
        console.log(data); // For debugging

        if (data && Array.isArray(data.products)) {
          setProducts(data.products); // Set the products data to state
        } else {
          setMessage('Không có sản phẩm nào được tìm thấy.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching data
      }
    };

    fetchProducts();
  }, []);
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

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f4f4', paddingBottom: '40px' }}>
      <header style={{ backgroundColor: 'rgba(44, 19, 6, 0.9)', padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0, color: '#e6b17e' }}>Quản lý sản phẩm</h1>
        <div>
        <button onClick={handleLogout} style={buttonStyles}>Đăng xuất</button>
          <a href="/admin/manage-products" style={styles.button}>Quản lý sản phẩm</a>
          <a href="/admin/orders" style={styles.button}>Quản lý đơn hàng</a>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '30px', background: 'rgba(44, 19, 6, 0.85)', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)', width: '95%' }}>
        {message && (
          <p style={{ color: 'green', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        <h2 style={{ color: '#e6b17e', fontFamily: 'Playfair Display', marginBottom: '20px' }}>Danh sách sản phẩm</h2>

        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={styles.product}>
              {product.image ? (
                <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} style={styles.productImage} />
              ) : (
                <p>Không có hình ảnh.</p>
              )}
              <div style={styles.productDetails}>
                <h2 style={{ color: '#e6b17e', fontFamily: 'Playfair Display', fontSize: '1.6rem' }}>{product.name}</h2>
                <p style={{ color: '#ddd', fontSize: '1.1rem' }}>
                  Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <p style={{ color: '#ddd', fontSize: '1.1rem' }}>Mô tả: {product.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào được tìm thấy.</p>
        )}
      </div>
    </div>
  );
};

// Inline styles for components (instead of using CSS)
const styles = {
  button: {
    padding: '10px 20px',
    marginLeft: '10px',
    backgroundColor: '#c17f59',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  product: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
    padding: '20px',
    background: 'rgba(59, 28, 12, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  productImage: {
    width: '180px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  productDetails: {
    flex: '1',
    marginLeft: '25px',
  },
};

export default AdminProducts;
