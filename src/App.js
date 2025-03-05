import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home1 from './pages/Home';
import Home2 from './pages/home2.js'; 
import Login from '../src/components/Login.js';
import './App.css';
import Signup from './components/Signup.js';
import UpdateUser from './components/UpdateUser';
import UpdatePassword from './components/UpdatePassword.js';
import AdminDashboard from './components/AdminDashboard.js';
function App() {
  // eslint-disable-next-line
  const [userData, setUserData] = useState(null);
  // eslint-disable-next-line
  const [errorMessages, setErrorMessages] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/home2" element={<Home2 />} /> 
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/update-user" element={<UpdateUser user={userData} errors={errorMessages} />} />
        <Route path="/update-password" element={<UpdatePassword errors={errorMessages} />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
