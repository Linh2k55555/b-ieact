import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartSidebar from './CartSidebar';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  width: 100%;
  background: ${(props) => (props.scrolled ? '#fff' : 'transparent')};
  box-shadow: ${(props) => (props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none')};
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  z-index: 1000;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => (props.scrolled ? '#333' : '#fff')};
  transition: color 0.3s;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin: 0 15px;
  font-size: 16px;
  text-decoration: none;
  color: ${(props) => (props.scrolled ? '#333' : '#fff')};
  transition: color 0.3s;
  &:hover {
    color: #ff6600;
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${(props) => (props.scrolled ? '#333' : '#fff')};
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  list-style: none;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.open ? 'block' : 'none')};
  min-width: 160px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #333;
  &:hover {
    background: #f5f5f5;
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${(props) => (props.scrolled ? '#333' : '#fff')};
`;

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        navigate('/');
        alert('Đăng xuất thành công!');
      }
    } catch (error) {
      alert('Có lỗi xảy ra trong khi đăng xuất!');
    }
  };

  return (
    <>
      <NavbarContainer scrolled={scrolled}>
        <Logo to="/home2" scrolled={scrolled}>
          Coffee House
        </Logo>
        <NavLinks>
          <NavLink to="/home2" scrolled={scrolled}>Trang chủ</NavLink>
          <NavLink as="a" href="#menu" scrolled={scrolled}>Menu</NavLink>

          <Dropdown>
            <DropdownButton onClick={toggleDropdown} scrolled={scrolled}>👤</DropdownButton>
            <DropdownMenu open={dropdownOpen}>
              <DropdownItem to="/update-password">Đổi mật khẩu</DropdownItem>
              <DropdownItem to="/user/update-user">Đổi thông tin</DropdownItem>
              <DropdownItem to="/transactions">Lịch sử giao dịch</DropdownItem>
              <DropdownItem as="button" onClick={handleLogout}>Đăng xuất</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <CartButton onClick={toggleCart} scrolled={scrolled}>🛒 Giỏ hàng</CartButton>
        </NavLinks>
      </NavbarContainer>

      {cartOpen && <CartSidebar onClose={toggleCart} />}
    </>
  );
};

export default Navbar2;
