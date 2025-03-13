import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    margin-bottom: 20px;
    font-weight: bold;
  }
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  color: #fff;
  font-size: 1.1rem;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff4b2b, #ff416c);
    transform: scale(1.05);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const ExtraLinks = styled.div`
  margin-top: 15px;
  a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #ffcccb;
    }
  }
`;

const UpdateUser = () => {
  const [formData, setFormData] = useState({ username: "", age: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setFormData({
          username: response.data.user.username,
          age: response.data.user.age,
        });
      } catch (error) {
        alert("Lỗi khi lấy thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/user/update", formData, {
        withCredentials: true,
      });

      alert("Cập nhật thông tin thành công!");

      setTimeout(() => {
        window.location.href = "/home2";
      }, 2000);
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <FormContainer>
        <h2>Cập nhật thông tin</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên người dùng:</label>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <label>Tuổi:</label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </form>
        <ExtraLinks>
          <p>
            <a href="/home2">Quay lại trang chủ</a>
          </p>
        </ExtraLinks>
      </FormContainer>
    </Container>
  );
};

export default UpdateUser;
