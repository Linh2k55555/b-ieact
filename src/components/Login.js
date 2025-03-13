import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;

  input {
    border: none;
    background: transparent;
    width: 100%;
    font-size: 16px;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s;

  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#0056b3")};
  }
`;

const ExtraLinks = styled.div`
  margin-top: 15px;
  
  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/signin', 
        { email, password }, 
        { withCredentials: true }
      );

      if (response.data.message) {
        window.alert(response.data.message);

        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl; 
        }
      }
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.message || 'Lỗi khi kết nối đến server');
      } else if (error.request) {
        window.alert('Không thể kết nối đến máy chủ');
      } else {
        window.alert('Lỗi khi gửi yêu cầu'); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Đăng nhập</Title>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <ExtraLinks>
          <p><a href="/forgot-password">Quên mật khẩu?</a></p>
          <p>Bạn chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
        </ExtraLinks>
      </FormWrapper>
    </Container>
  );
};

export default Login;
