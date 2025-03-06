import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: '',
  });
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/cities');
        setCities(response.data || []);
      } catch (error) {
        console.error('❌ Lỗi khi tải danh sách thành phố:', error);
        window.alert("Không thể tải danh sách thành phố!");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCartTotal = async () => {
      try {
        const response = await axios.get('/api/cart');
        if (response.data.items) {
          const totalAmount = response.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          setTotal(totalAmount);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy tổng tiền giỏ hàng:', error);
        window.alert("Không thể lấy tổng tiền giỏ hàng!");
      }
    };
    fetchCartTotal();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = async (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city, district: '', ward: '' }));

    if (!city) return;
    try {
      const response = await axios.get(`/api/districts/${city}`);
      setDistricts(response.data || []);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách quận/huyện:', error);
      window.alert("Không thể tải danh sách quận/huyện!");
    }
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData((prev) => ({ ...prev, district, ward: '' }));

    if (!district) return;
    try {
      const response = await axios.get(`/api/wards/${district}`);
      setWards(response.data.wards || []);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách phường/xã:', error);
      window.alert("Không thể tải danh sách phường/xã!");
      setWards([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmOrder = window.confirm("Bạn có chắc chắn muốn thanh toán đơn hàng?");
    if (!confirmOrder) return;

    try {
      const response = await axios.post("/checkout", formData);
      window.alert(response.data.message || "Thanh toán thành công!");
      
      navigate("/home2");
    } catch (error) {
      console.error("❌ Lỗi khi gửi đơn hàng:", error);
      window.alert("Đã xảy ra lỗi khi thanh toán, vui lòng thử lại.");
    }
  };

  return (
    <div className="checkout-container">
      <header>
        <h1>Thanh toán đơn hàng</h1>
      </header>
      <div className="container">
        <h2>Thông tin thanh toán</h2>
        <form onSubmit={handleSubmit}>
          <label>Họ và Tên:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
          
          <label>Số điện thoại:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
          
          <label>Địa chỉ chi tiết:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
          
          <label>Tỉnh/Thành phố:</label>
          <select name="city" value={formData.city} onChange={handleCityChange} required>
            <option value="">Chọn Tỉnh/Thành phố</option>
            {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
          
          <label>Quận/Huyện:</label>
          <select name="district" value={formData.district} onChange={handleDistrictChange} required>
            <option value="">Chọn Quận/Huyện</option>
            {districts.map(district => <option key={district.id} value={district.id}>{district.name}</option>)}
          </select>
          
          <label>Phường/Xã:</label>
          <select name="ward" value={formData.ward} onChange={handleInputChange} required>
            <option value="">Chọn Phường/Xã</option>
            {wards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
          </select>
          
          <label>Hình thức thanh toán:</label>
          <div>
            <label>
              <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} required /> Thanh toán khi nhận hàng
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={handleInputChange} /> Chuyển khoản
            </label>
          </div>

          <div className="total-container">
            <p>Tổng thanh toán:</p>
            <div className="total-amount">{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          </div>

          <button type="submit">Thanh toán</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
