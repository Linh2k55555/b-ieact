import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/signup", {
        username,
        email,
        password,
        confirmPassword,
        age,
      });

      window.alert("Đăng ký thành công! Đang chuyển hướng...");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message || "Đã có lỗi xảy ra.");
        setErrors([error.response.data.message]);
      } else {
        window.alert("Không thể kết nối với server.");
        setErrors([]);
      }
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Đăng ký</Title>

        {errors.length > 0 && (
          <Message>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Message>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nhập tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Input
            type="number"
            placeholder="Nhập tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <Button type="submit">Đăng ký</Button>
        </form>

        <Message>
          Bạn đã có tài khoản? <a href="/signin">Đăng nhập</a>
        </Message>
      </FormWrapper>
    </Container>
  );
};

export default Signup;
