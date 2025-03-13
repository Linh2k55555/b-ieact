import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background: #f9f9f9;

  i {
    color: #888;
    margin-right: 10px;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  background: ${({ disabled }) => (disabled ? "#bdc3c7" : "#3498db")};
  color: white;
  border: none;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: 0.3s;

  &:hover {
    background: ${({ disabled }) => (disabled ? "#bdc3c7" : "#2980b9")};
  }
`;

const BackLink = styled.a`
  display: block;
  margin-top: 15px;
  text-decoration: none;
  color: #3498db;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/update-password", formData, {
        withCredentials: true,
      });

      window.alert("Cập nhật mật khẩu thành công!");

      setTimeout(() => {
        navigate("/home2");
      }, 2000);
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message || "Lỗi khi cập nhật mật khẩu.");
      } else {
        window.alert("Không thể kết nối đến máy chủ.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Cập nhật mật khẩu</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="oldPassword"
            placeholder="Mật khẩu cũ"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <i className="fas fa-key"></i>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu mới"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <i className="fas fa-check"></i>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <Button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </Form>

      <BackLink href="/home2">Quay lại trang chủ</BackLink>
    </Container>
  );
};

export default UpdatePassword;
