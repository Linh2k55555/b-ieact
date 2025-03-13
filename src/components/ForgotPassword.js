import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
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
    margin-left: 10px;
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
  background: ${(props) => (props.disabled ? "#ccc" : "#28a745")};
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s;

  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#218838")};
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSend = window.confirm("Bạn có chắc muốn gửi yêu cầu đặt lại mật khẩu?");
    if (!confirmSend) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/forgot-password", { email });
      window.alert(response.data.message || "Liên kết đặt lại mật khẩu đã được gửi!");
      navigate("/signin");
    } catch (error) {
      window.alert("❌ Lỗi! Không thể gửi yêu cầu. Hãy thử lại.");
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <FormContainer>
        <Title>Quên mật khẩu</Title>
        <Description>Nhập email của bạn để nhận liên kết đặt lại mật khẩu</Description>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>

        <ExtraLinks>
          <p><a href="/signin">Quay lại đăng nhập</a></p>
        </ExtraLinks>
      </FormContainer>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
