import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home1 from './pages/Home';
import Home2 from './pages/home2'; // Ensure correct casing for file name
import Login from './components/Login';
import Signup from './components/Signup';
import UpdateUser from './components/UpdateUser';
import UpdatePassword from './components/UpdatePassword';
import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './components/ManageProductsAdmin.js';
import AdminOrders from './components/AdminOrder.js';
import CheckOut from './components/CheckOut.js';
function App() {
  // eslint-disable-next-line
  const [userData, setUserData] = useState(null);
  // eslint-disable-next-line
  const [errorMessages, setErrorMessages] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Updated to path="/" to correctly route to the homepage */}
        <Route path="/" element={<Home1 />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/update-user" element={<UpdateUser user={userData} errors={errorMessages} />} />
        <Route path="/update-password" element={<UpdatePassword errors={errorMessages} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
         <Route path="/admin/orders" element={<AdminOrders />} />
         <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </Router>
  );
}

export default App;
