import React, { useState, useEffect } from 'react';

const Checkout = () => {
  const [total, setTotal] = useState(0); // You can replace this with actual logic to calculate the total
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: '',
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCityChange = async (e) => {
    const city = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city,
      district: '', // Reset district when city changes
      ward: '', // Reset ward when city changes
    }));

    // Fetch the districts based on the selected city
    const response = await fetch(`/api/districts/${city}`);
    const data = await response.json();
    setDistricts(data.districts || []);
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district,
      ward: '', // Reset ward when district changes
    }));

    // Fetch the wards based on the selected district
    const response = await fetch(`/api/wards/${district}`);
    const data = await response.json();
    setWards(data.wards || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment or form submission logic here
    alert('Form submitted');
  };

  useEffect(() => {
    // Load initial data for provinces (cities)
    const fetchCities = async () => {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data.cities || []);
    };
    fetchCities();
  }, []);

  return (
    <div className="checkout-container">
      <header>
        <h1>Thanh toán đơn hàng</h1>
      </header>

      <div className="container">
        <h2>Thông tin thanh toán</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Họ và Tên:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="phoneNumber">Số điện thoại:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="address">Địa chỉ chi tiết:</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Số nhà, tên đường"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <div className="row">
            <div>
              <label htmlFor="city">Tỉnh/Thành phố:</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                required
              >
                <option value="" disabled>
                  Chọn Tỉnh/Thành phố
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="district">Quận/Huyện:</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                required
              >
                <option value="" disabled>
                  Chọn Quận/Huyện
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="ward">Phường/Xã:</label>
          <select
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Chọn Phường/Xã
            </option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>

          <div className="payment-method">
            <label>
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleInputChange}
                required
              />
              Thanh toán khi nhận hàng
            </label>
            <label>
              <input
                type="radio"
                id="transfer"
                name="paymentMethod"
                value="transfer"
                checked={formData.paymentMethod === 'transfer'}
                onChange={handleInputChange}
              />
              Chuyển khoản
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
