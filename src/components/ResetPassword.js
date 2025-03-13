import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const FormWrapper = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  text-align: center;
  width: 100%;
  max-width: 400px;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #764ba2, #667eea);
    transform: scale(1.05);
  }
`;

const Message = styled.p`
  font-size: 1rem;
  margin-top: 15px;
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`http://localhost:8080/reset-password/${token}`);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      window.alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      window.alert("Mật khẩu đã được cập nhật! Chuyển hướng về trang đăng nhập...");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      window.alert("Lỗi khi đặt lại mật khẩu, vui lòng thử lại.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Đặt lại mật khẩu</Title>

        {validToken === null ? (
          <Message>Đang kiểm tra liên kết...</Message>
        ) : validToken ? (
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Đặt lại mật khẩu</Button>
          </form>
        ) : (
          <Message>Liên kết đã hết hạn hoặc không hợp lệ.</Message>
        )}
      </FormWrapper>
    </Container>
  );
};

export default ResetPassword;
