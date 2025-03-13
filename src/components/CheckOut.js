import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 🎨 Styled Components
const CheckoutContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin: 5px 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Select = styled.select`
  padding: 8px;
  margin: 5px 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const TotalContainer = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0;
`;

const Button = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: #2ecc71;
  }
`;

const Checkout = () => {
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/cities");
        setCities(response.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách thành phố:", error);
        window.alert("Không thể tải danh sách thành phố!");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCartTotal = async () => {
      try {
        const response = await axios.get("/api/cart");
        if (response.data.items) {
          const totalAmount = response.data.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          setTotal(totalAmount);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy tổng tiền giỏ hàng:", error);
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
    setFormData((prev) => ({ ...prev, city, district: "", ward: "" }));

    if (!city) return;
    try {
      const response = await axios.get(`/api/districts/${city}`);
      setDistricts(response.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách quận/huyện:", error);
      window.alert("Không thể tải danh sách quận/huyện!");
    }
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData((prev) => ({ ...prev, district, ward: "" }));

    if (!district) return;
    try {
      const response = await axios.get(`/api/wards/${district}`);
      setWards(response.data.wards || []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách phường/xã:", error);
      window.alert("Không thể tải danh sách phường/xã!");
      setWards([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmOrder = window.confirm(
      "Bạn có chắc chắn muốn thanh toán đơn hàng?"
    );
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
    <CheckoutContainer>
      <Header>Thanh toán đơn hàng</Header>
      <Form onSubmit={handleSubmit}>
        <Label>Họ và Tên:</Label>
        <Input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />

        <Label>Số điện thoại:</Label>
        <Input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />

        <Label>Địa chỉ chi tiết:</Label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        <Label>Tỉnh/Thành phố:</Label>
        <Select name="city" value={formData.city} onChange={handleCityChange} required>
          <option value="">Chọn Tỉnh/Thành phố</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>

        <Label>Quận/Huyện:</Label>
        <Select name="district" value={formData.district} onChange={handleDistrictChange} required>
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </Select>

        <Label>Phường/Xã:</Label>
        <Select name="ward" value={formData.ward} onChange={handleInputChange} required>
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </Select>

        <Label>Hình thức thanh toán:</Label>
        <RadioGroup>
          <RadioLabel>
            <input type="radio" name="paymentMethod" value="cod" onChange={handleInputChange} required /> Thanh toán khi nhận hàng
          </RadioLabel>
          <RadioLabel>
            <input type="radio" name="paymentMethod" value="transfer" onChange={handleInputChange} /> Chuyển khoản
          </RadioLabel>
        </RadioGroup>

        <TotalContainer>Tổng thanh toán: {total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</TotalContainer>

        <Button type="submit">Thanh toán</Button>
      </Form>
    </CheckoutContainer>
  );
};

export default Checkout;
